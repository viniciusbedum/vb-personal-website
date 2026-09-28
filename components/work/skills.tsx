import { getTranslations } from "next-intl/server";
import { SKILLS } from "@/lib/content/skills";

type SkillsProps = {
  locale: string;
};

/**
 * Tablet+: tags fill columns of 3 from top to bottom, then the next column
 * to the right, so any number of skills keeps the same spacing. Each tag is
 * nudged a few px right/down (dx, dy) for a loose, hand-placed look.
 */
const NUDGES = [
  { dx: 0, dy: 0 },
  { dx: 28, dy: 8 },
  { dx: 8, dy: 20 },
  { dx: 20, dy: 16 },
  { dx: 0, dy: 4 },
  { dx: 32, dy: 12 },
  { dx: 12, dy: 0 },
];

/**
 * Motion: each tag rests `pause` seconds, glides to (x, y) in 1s, rests, glides
 * back ("mirror" loop). Different pauses keep them out of sync, like
 * several people's cursors. The glide shrinks (30% mobile, 60% tablet+) so
 * tags stay inside the screen and off their neighbors.
 */
const MOTIONS = [
  { x: -30, y: -20, pause: 3 },
  { x: 17, y: 26, pause: 5 },
  { x: 50, y: 8, pause: 4 },
  { x: -40, y: 16, pause: 3.5 },
  { x: -30, y: 20, pause: 4.5 },
  { x: 15, y: -40, pause: 5.5 },
  { x: -20, y: -16, pause: 3.8 },
];

const EASE = "cubic-bezier(0.44, 0, 0.56, 1)";

function motionCss(): string {
  const rules = MOTIONS.map(({ x, y, pause }, index) => {
    const cycle = 2 * (1 + pause);
    const hold = ((pause / cycle) * 100).toFixed(2);
    const holdBack = (50 + (pause / cycle) * 100).toFixed(2);
    return `@keyframes skill-move-${index}{0%,${hold}%{transform:translate(0,0)}50%,${holdBack}%{transform:translate(calc(var(--skill-reach)*${x}px),calc(var(--skill-reach)*${y}px))}100%{transform:translate(0,0)}}.skill-move-${index}{animation:skill-move-${index} ${cycle}s ${EASE} infinite}`;
  });
  return `.skill-tags{--skill-reach:0.3}@media (min-width:810px){.skill-tags{--skill-reach:0.6}}@media (prefers-reduced-motion: no-preference){${rules.join("")}}`;
}

/**
 * Rounded mouse pointer (tip up-left), drawn like the tag (same fill, 1px
 * border) and sitting just off its corner.
 */
function CursorIcon() {
  return (
    <svg
      viewBox="0 0 18 18"
      aria-hidden
      className="pointer-events-none absolute -top-[11.5px] -left-[11.5px] size-[18px] overflow-visible fill-secondary stroke-border"
    >
      <path
        strokeWidth={1}
        d="M 6.235 15.194 L 2.251 4.836 C 1.63 3.22 3.22 1.63 4.836 2.252 L 15.193 6.235 C 16.749 6.833 16.933 8.96 15.505 9.817 L 12.378 11.693 C 12.096 11.862 11.861 12.097 11.692 12.379 L 9.817 15.505 C 8.959 16.934 6.833 16.749 6.235 15.194 Z"
      />
    </svg>
  );
}

/**
 * "Skills" section for the Work page: tags with a cursor on the top-left
 * corner, gliding now and then like collaborators' cursors in Figma.
 */
export async function Skills({ locale }: SkillsProps) {
  const t = await getTranslations({ locale, namespace: "work" });
  const area = locale === "en" ? "en" : "pt";

  return (
    <section className="overflow-x-clip">
      <style>{motionCss()}</style>
      <h2 className="font-mono text-[13px] leading-[0.8] tracking-[0.6px] uppercase text-muted-foreground">
        {t("skillsTitle")}
      </h2>
      <ul className="skill-tags mt-8 flex flex-wrap gap-x-6 gap-y-7 pr-4 pl-7 tablet:grid tablet:grid-flow-col tablet:grid-rows-3 tablet:auto-cols-max tablet:items-start tablet:gap-x-14 tablet:gap-y-6">
        {SKILLS.map((skill, index) => {
          return (
            <li
              key={skill.label.en}
              className="relative tablet:mt-[var(--dy)] tablet:ml-[var(--dx)]"
              style={
                {
                  "--dx": `${NUDGES[index % NUDGES.length].dx}px`,
                  "--dy": `${NUDGES[index % NUDGES.length].dy}px`,
                } as React.CSSProperties
              }
            >
              <span
                className={`relative inline-block skill-move-${index % MOTIONS.length}`}
              >
                <CursorIcon />
                <span className="inline-flex items-center rounded-tl-xl border border-border bg-secondary px-3 py-2 text-[13px] leading-none font-medium tracking-[0.4px] whitespace-nowrap text-foreground">
                  {skill.label[area]}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
