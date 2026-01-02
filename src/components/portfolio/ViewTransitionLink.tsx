"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

type ViewTransitionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export default function ViewTransitionLink({
  href,
  onClick,
  ...props
}: ViewTransitionLinkProps) {
  const router = useRouter();

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }
    event.preventDefault();
    if (prefersReducedMotion) {
      router.push(href);
      return;
    }
    const startTransition = (
      document as unknown as {
        startViewTransition?: (callback: () => void) => void;
      }
    ).startViewTransition;
    if (startTransition) {
      try {
        startTransition(() => router.push(href));
        return;
      } catch {
        // fall through
      }
    }
    router.push(href);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
