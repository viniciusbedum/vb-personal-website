export type LabeledSectionProps = {
  label: string;
  children: React.ReactNode;
  /**
   * Px to push the label down (desktop only) so it lines up with the first
   * line of text when the content doesn't start with text at its top edge.
   */
  labelOffset?: number;
};

/**
 * Home section in a two-column layout: from 1200px the mono
 * label (uppercase, like the location line and the Work page labels) hangs
 * to the left of the content column (right-aligned, 40px gap), its 22.5px
 * line matching the 15px body text's;
 * below that the label is hidden, but kept for
 * screen readers as the section heading.
 */
export function LabeledSection({
  label,
  children,
  labelOffset = 0,
}: LabeledSectionProps) {
  return (
    <section className="relative">
      <div
        className="desktop:absolute desktop:top-0 desktop:right-full desktop:mt-[var(--label-offset)] desktop:mr-10"
        style={{ "--label-offset": `${labelOffset}px` } as React.CSSProperties}
      >
        <h2 className="sr-only font-mono text-[13px] leading-[22.5px] tracking-[0.6px] whitespace-nowrap uppercase text-muted-foreground desktop:not-sr-only">
          {label}
        </h2>
      </div>
      {children}
    </section>
  );
}
