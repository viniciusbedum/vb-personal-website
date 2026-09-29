import Image from "next/image";
import { isValidElement, type ReactNode } from "react";
import Markdown, { type Components } from "react-markdown";
import { isDateHeading, parseSourceBlock } from "@/lib/content/blocks";
import { cn } from "@/lib/utils";

export type BodyHeading = { id: string; text: string };

type LinedHeading = BodyHeading & { line: number };

const IMAGE_SIZES = "(min-width: 810px) 640px, calc(100vw - 32px)";

/** Slug an `h2` heading text: NFD, strip diacritics, lowercase, non `[a-z0-9]` runs → `-`, trim, empty → "secao". */
function slugifyHeading(text: string): string {
  const slug = text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "secao";
}

/** Dedupe a slug against ones already seen, appending `-2`, `-3`… in document order. */
function dedupeSlug(slug: string, seen: Map<string, number>): string {
  const count = seen.get(slug) ?? 0;
  seen.set(slug, count + 1);
  return count === 0 ? slug : `${slug}-${count + 1}`;
}

/**
 * Walk the Markdown source once, collecting `## ` headings in document
 * order with their 1-based source line — the same line numbers
 * react-markdown exposes on each rendered node's `node.position`, so the
 * `h2` component can look up its id without a mutable render-time counter.
 */
function computeHeadings(body: string): LinedHeading[] {
  const seen = new Map<string, number>();
  const headings: LinedHeading[] = [];

  body.split("\n").forEach((line, index) => {
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (!match) return;
    const text = match[1];
    headings.push({ id: dedupeSlug(slugifyHeading(text), seen), text, line: index + 1 });
  });

  return headings;
}

/** `h2` headings in document order, for the "on this page" index — same ids as the rendered body. */
export function getBodyHeadings(body: string): BodyHeading[] {
  return computeHeadings(body).map(({ id, text }) => ({ id, text }));
}

/** Plain text of a rendered children tree (strings and nested elements). */
function childrenText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(childrenText).join("");
  if (isValidElement<{ children?: ReactNode }>(children)) return childrenText(children.props.children);
  return "";
}

const LINK_CLASS = "underline underline-offset-4";

/** Body link: external ones open in a new tab. */
const bodyLink: Components["a"] = ({ children, href }) => {
  const isExternal = /^https?:\/\//.test(href ?? "");
  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={LINK_CLASS}
    >
      {children}
    </a>
  );
};

/** Inline-only Markdown for a ```note fence: paragraphs collapse into the surrounding line. */
const noteComponents: Components = {
  p: ({ children }) => <>{children}</>,
  a: bodyLink,
  strong: ({ children }) => <strong>{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
};

/**
 * Project case body: Markdown renderer for the "Corpo" section.
 * Server component — no client-side state.
 */
export function ProjectBody({ body }: { body: string }) {
  const headingsByLine = new Map(
    computeHeadings(body).map((heading) => [heading.line, heading.id]),
  );

  const components: Components = {
    p: ({ children }) => <p>{children}</p>,
    h2: ({ children, node }) => (
      <h2
        id={node?.position ? headingsByLine.get(node.position.start.line) : undefined}
        className="mt-12 mb-4 text-xl leading-[1.3] text-foreground scroll-mt-8"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) =>
      isDateHeading(childrenText(children)) ? (
        <h3 className="mt-8 mb-2 font-mono text-[13px] leading-[0.8] tracking-[0.6px] uppercase text-muted-foreground">
          {children}
        </h3>
      ) : (
        <h3 className="mt-8 mb-3 text-[17px] leading-[1.4]">{children}</h3>
      ),
    pre: ({ children }) => <>{children}</>,
    code: ({ children, className }) => {
      const text = childrenText(children);
      const language = /language-(\w+)/.exec(className ?? "")?.[1];
      const isBlock = language !== undefined || text.includes("\n");

      if (!isBlock) return <code className="font-mono text-[0.9em]">{children}</code>;

      if (language === "source") {
        const entry = parseSourceBlock(text);
        if (!entry) return null;
        return (
          <div className="mt-[22.5px] border-b border-border pb-6 first:mt-0">
            {entry.kicker ? (
              <p className="font-mono text-[13px] leading-[1.2] tracking-[0.6px] uppercase text-muted-foreground">
                {entry.kicker}
              </p>
            ) : null}
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(LINK_CLASS, "mt-2 block text-[17px] leading-[1.4]")}
            >
              {entry.title}
            </a>
            {entry.meta ? (
              <p className="mt-1 text-[13px] leading-[1.4] text-muted-foreground">{entry.meta}</p>
            ) : null}
            {entry.description ? (
              <p className="mt-3 text-muted-foreground">{entry.description}</p>
            ) : null}
          </div>
        );
      }

      if (language === "note") {
        const note = text.trim();
        if (!note) return null;
        return (
          <p className="mt-3! text-[13px] leading-[1.4] font-normal text-muted-foreground">
            <Markdown components={noteComponents}>{note}</Markdown>
          </p>
        );
      }

      return (
        <pre className="mt-[22.5px] overflow-x-auto rounded-lg bg-muted p-4 font-mono text-[13px]">
          <code>{text}</code>
        </pre>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="mt-[22.5px] border-l border-border pl-4 text-muted-foreground">
        {children}
      </blockquote>
    ),
    ul: ({ children }) => <ul className="pl-5 list-disc">{children}</ul>,
    ol: ({ children }) => <ol className="pl-5 list-decimal">{children}</ol>,
    li: ({ children }) => <li className="mt-2">{children}</li>,
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    a: bodyLink,
    img: ({ src, alt }) => (
      <figure className="mt-10">
        <Image
          src={typeof src === "string" ? src : ""}
          alt={alt ?? ""}
          width={1280}
          height={853}
          sizes={IMAGE_SIZES}
          className="h-auto w-full rounded-xl"
        />
      </figure>
    ),
  };

  return (
    <div
      className={cn(
        "mt-10 text-[15px] leading-[1.5]",
        "[&>p]:mt-[22.5px] [&>ul]:mt-[22.5px] [&>ol]:mt-[22.5px]",
      )}
    >
      <Markdown components={components}>{body}</Markdown>
    </div>
  );
}
