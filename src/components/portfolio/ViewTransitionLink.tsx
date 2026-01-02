import type { AnchorHTMLAttributes } from "react";
import Link from "next/link";

type ViewTransitionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export default function ViewTransitionLink({
  href,
  ...props
}: ViewTransitionLinkProps) {
  return <Link href={href} {...props} />;
}
