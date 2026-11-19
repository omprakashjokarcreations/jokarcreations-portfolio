/** Small shared building blocks that give every section the same editorial voice. */
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { scrollToHash } from "./motion";

/** Page gutter + max width used by every section. */
export const SHELL = "mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12";

/**
 * Pill call-to-action with a rolling label and a sliding arrow.
 * Renders an anchor; in-page hashes scroll smoothly.
 */
export function CtaLink({
  href,
  children,
  variant = "solid",
  className,
  external = false,
}: {
  href: string;
  children: string;
  variant?: "solid" | "outline" | "ink";
  className?: string;
  external?: boolean;
}) {
  const styles = {
    solid: "bg-foreground text-background",
    outline: "border border-foreground/20 text-foreground hover:border-foreground/60",
    ink: "bg-ink text-paper",
  }[variant];

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onClick={(e) => {
        if (!external && href.startsWith("#")) {
          e.preventDefault();
          scrollToHash(href);
        }
      }}
      className={cn(
        "group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full pl-6 pr-2 text-sm font-semibold transition-colors duration-300",
        styles,
        className,
      )}
    >
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
      <span
        aria-hidden
        className={cn(
          "grid h-8 w-8 place-items-center overflow-hidden rounded-full",
          variant === "solid"
            ? "bg-magenta text-white"
            : variant === "ink"
              ? "bg-paper text-ink"
              : "bg-foreground text-background",
        )}
      >
        <span className="relative block h-4 w-4">
          <ArrowUpRight className="absolute inset-0 h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-5 group-hover:translate-x-5" />
          <ArrowUpRight className="absolute inset-0 h-4 w-4 -translate-x-5 translate-y-5 transition-transform duration-500 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0" />
        </span>
      </span>
    </a>
  );
}
