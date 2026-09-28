"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type CopyEmailButtonProps = {
  email: string;
  label: string;
  copiedLabel: string;
  className?: string;
};

/** Copies `email` to the clipboard and shows a "copied" state for 2s. */
export function CopyEmailButton({
  email,
  label,
  copiedLabel,
  className,
}: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard unavailable (insecure context / denied): leave as is.
    }
  }

  const Icon = copied ? Check : Copy;

  return (
    <button type="button" onClick={handleClick} className={className}>
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
      <Icon
        className={cn("size-[18px]", copied ? "text-brand" : "text-muted-foreground")}
        weight="regular"
        aria-hidden
      />
    </button>
  );
}
