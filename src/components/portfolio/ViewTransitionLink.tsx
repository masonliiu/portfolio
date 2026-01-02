"use client";

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
      startTransition(() => router.push(href));
    } else {
      router.push(href);
    }
  };

  return <a href={href} onClick={handleClick} {...props} />;
}
