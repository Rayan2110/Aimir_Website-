import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Magnetic } from "@/components/motion/Magnetic";

type Variant = "primary" | "ghost" | "line" | "dark";

const base =
  "group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-[3px] font-mono text-[12px] uppercase tracking-[0.14em] transition-[color,background-color,border-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "h-12 px-6 bg-volt text-ink-950 hover:bg-volt-2 shadow-[0_0_0_1px_rgb(240_163_59/0.4),0_10px_40px_-10px_rgb(240_163_59/0.55)] hover:shadow-[0_0_0_1px_rgb(255_191_102/0.6),0_14px_60px_-10px_rgb(240_163_59/0.75)]",
  ghost: "h-12 px-6 border border-[var(--line-strong)] text-current hover:border-current",
  line: "h-auto px-0 text-current",
  dark: "h-12 px-6 bg-ink-950 text-fg hover:bg-ink-800",
};

function Inner({ children, arrow }: { children: ReactNode; arrow: boolean }) {
  return (
    <>
      <span className="relative">{children}</span>
      {arrow && (
        <span aria-hidden className="relative inline-flex h-3 w-4 overflow-hidden">
          <svg viewBox="0 0 16 12" className="absolute inset-0 h-3 w-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-full">
            <path d="M0 6h14M9 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <svg viewBox="0 0 16 12" className="absolute inset-0 h-3 w-4 -translate-x-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-0">
            <path d="M0 6h14M9 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </span>
      )}
    </>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  arrow = true,
  magnetic = false,
  className,
  children,
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; arrow?: boolean; magnetic?: boolean }) {
  const link = (
    <Link href={href} className={cn(base, variants[variant], variant === "line" && "link-u pb-1", className)} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  );
  return magnetic ? <Magnetic>{link}</Magnetic> : link;
}

export function Button({
  variant = "primary",
  arrow = false,
  className,
  children,
  ...rest
}: ComponentProps<"button"> & { variant?: Variant; arrow?: boolean }) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
}
