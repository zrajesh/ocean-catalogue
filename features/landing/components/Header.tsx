import { NAV_LINKS } from "../content";

export function Header() {
  return (
    <header>
      <div className="wrap nav">
        <a className="logo" href="#top">
          Ocean<b>Catalogue</b>
        </a>
        <nav className="links" aria-label="Main">
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="btn gold sm" href="#quote">
          Get a quote
        </a>
      </div>
    </header>
  );
}
