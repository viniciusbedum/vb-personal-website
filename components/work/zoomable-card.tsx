"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { ArrowsOutSimple, X } from "@phosphor-icons/react";
import type { CardEntry } from "@/lib/content/blocks";

const CARD_SIZES = "(min-width: 640px) 312px, calc(100vw - 32px)";
const ZOOM_SIZES = "(min-width: 892px) 836px, calc(100vw - 56px)";

/**
 * One card of a ```cards block. Hovering the image shows an expand icon, and
 * a click opens it large in a
 * native modal dialog over a darkened, blurred page; Esc, the close button
 * or a click outside closes it. The large image only loads once opened.
 * The text comes in as children, rendered on the server.
 */
export function ZoomableCard({
  card,
  closeLabel,
  children,
}: {
  card: CardEntry;
  closeLabel: string;
  /** The card text, already rendered (inline Markdown). */
  children?: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  function show() {
    setOpen(true);
    dialogRef.current?.showModal();
  }

  return (
    <figure>
      <button
        type="button"
        onClick={show}
        className="group relative block w-full cursor-pointer overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      >
        <Image
          src={card.image}
          alt={card.alt}
          width={1280}
          height={853}
          sizes={CARD_SIZES}
          className="h-auto w-full rounded-xl"
        />
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition duration-200 group-hover:bg-black/30 group-hover:opacity-100 group-focus-visible:bg-black/30 group-focus-visible:opacity-100"
        >
          <span className="flex size-10 items-center justify-center rounded-lg border border-white/20 bg-black/55 text-white backdrop-blur-sm">
            <ArrowsOutSimple className="size-5" />
          </span>
        </span>
      </button>
      {card.title || card.text ? (
        <figcaption className="mt-3">
          {card.title ? <p className="text-foreground">{card.title}</p> : null}
          {card.text ? (
            <p className="mt-1 text-[13px] leading-[1.4] text-muted-foreground">{children}</p>
          ) : null}
        </figcaption>
      ) : null}

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto max-h-[calc(100dvh-32px)] w-[min(860px,calc(100vw-32px))] max-w-none overflow-y-auto overscroll-contain rounded-2xl border border-border bg-background p-3 text-[15px] outline-none leading-[1.5] text-foreground backdrop:bg-black/60 backdrop:backdrop-blur-md"
      >
        {open ? (
          <>
            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              aria-label={closeLabel}
              className="absolute right-5 top-5 z-10 flex size-8 cursor-pointer items-center justify-center rounded-lg border border-white/20 bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
            >
              <X className="size-4" aria-hidden />
            </button>
            <Image
              src={card.image}
              alt={card.alt}
              width={1280}
              height={853}
              sizes={ZOOM_SIZES}
              className="h-auto max-h-[calc(100dvh-140px)] w-full rounded-xl object-contain"
            />
            {card.title || card.text ? (
              <div className="mt-3 px-1 pb-1">
                {card.title ? <p>{card.title}</p> : null}
                {card.text ? (
                  <p className="mt-1 text-[13px] leading-[1.4] text-muted-foreground">{children}</p>
                ) : null}
              </div>
            ) : null}
          </>
        ) : null}
      </dialog>
    </figure>
  );
}
