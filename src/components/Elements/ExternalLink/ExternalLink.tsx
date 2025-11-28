import clsx from "clsx";

import { urlWithHttps } from "utils/urlWithHttps";

export type ExternalLinkProps = {
  to: string;
  className?: string;
};

export function ExternalLink({ to, className }: ExternalLinkProps) {
  const linkClass = "hover:underline";

  return (
    <a
      href={urlWithHttps(to)}
      className={clsx(linkClass, className)}
      target="_blank"
      rel="noreferrer"
    >
      {to}
    </a>
  );
}
