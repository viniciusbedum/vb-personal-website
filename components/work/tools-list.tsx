import { getTranslations } from "next-intl/server";
import { TOOLS } from "@/lib/content/tools";

type ToolsListProps = {
  locale: string;
};

/**
 * "Tools I use" section for the Work page — a pill list of the software
 * used to build and run the work shown above it.
 */
export async function ToolsList({ locale }: ToolsListProps) {
  const t = await getTranslations({ locale, namespace: "work" });
  const area = locale === "en" ? "en" : "pt";

  return (
    <section>
      <h2 className="font-mono text-[13px] leading-[0.8] tracking-[0.6px] uppercase text-muted-foreground">
        {t("toolsTitle")}
      </h2>
      <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-3">
        {TOOLS.map((tool) => (
          <li key={tool.name}>
            {/* Not linked for now: `tool.url` stays in the data for future (affiliate) links. */}
            <div className="inline-flex items-center gap-3 rounded-lg border border-border px-3 py-2">
              <img
                src={`/tools/${tool.icon}`}
                alt=""
                width={20}
                height={20}
                className="size-5 shrink-0"
              />
              <span className="flex flex-col">
                <span className="text-[13px] leading-[1.3] text-foreground">
                  {tool.name}
                </span>
                <span className="text-[12px] leading-[1.3] text-muted-foreground">
                  {tool.area[area]}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
