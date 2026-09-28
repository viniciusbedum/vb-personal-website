import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Single source of the site's button look (1px border, 39px, 15px medium).
 * Use `<Button>` for real buttons and `buttonVariants()` as the className of
 * links (`<a>`, next `<Link>`) that should look like a button. Layout-only
 * classes (width, margin, flex) are passed via `className`. Focus ring comes
 * from the global `:focus-visible` rule in `app/globals.css`.
 */
const variants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-border px-4 text-[15px] leading-[1.5] font-medium whitespace-nowrap shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-card",
      },
      size: {
        default: "h-[39px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/** Variant classes merged with `className` (conflicts resolved by `cn`). */
function buttonVariants({
  className,
  ...props
}: VariantProps<typeof variants> & { className?: string } = {}) {
  return cn(variants(props), className)
}

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: Omit<ButtonPrimitive.Props, "className"> &
  VariantProps<typeof variants> & { className?: string }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
}

export { Button, buttonVariants }
