import type { AnchorHTMLAttributes } from "react";

type ViewTransitionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export default function ViewTransitionLink({
  href,
  ...props
}: ViewTransitionLinkProps) {
  return <a href={href} {...props} />;
}
