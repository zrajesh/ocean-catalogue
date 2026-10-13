import Link from "next/link";
import { NAV_LINKS } from "../content";

type HeaderProps = { home?: boolean };

export function Header({ home = true }: HeaderProps) {
  const href = (target: string) => (home || !target.startsWith("#") ? target : `/${target}`);
  return (
    <header>
      <div className="wrap nav">
        <a className="logo" href={home ? "#top" : "/"}>
          Ocean<b>Catalogue</b>
        </a>
        <nav className="links" aria-label="Main">
          {NAV_LINKS.map(({ href: target, label }) =>
            target.startsWith("/") ? (
              <Link key={target} href={target}>
                {label}
              </Link>
            ) : (
              <a key={target} href={href(target)}>
                {label}
              </a>
            ),
          )}
        </nav>
        <a className="btn gold sm" href={href("#quote")}>
          Get a quote
        </a>
      </div>
    </header>
  );
}
