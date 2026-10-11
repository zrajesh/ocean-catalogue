import { CATALOGUE_VIEW_URL, HERO_FACTS, waLink } from "../content";

export function Hero() {
  return (
    <div className="hero">
      <div className="wrap">
        <div>
          <h1>Glassware that makes every pour look better</h1>
          <p>
            Wine, beer, coffee and bar glassware, supplied in bulk to hotels, restaurants and cafes. Custom
            branding available on request.
          </p>
          <div className="cta">
            <a className="btn gold" href={CATALOGUE_VIEW_URL}>
              View catalogue
            </a>
            <a className="btn line" href={waLink("Hi, I want glassware pricing")}>
              Chat on WhatsApp
            </a>
          </div>
          <div className="facts">
            {HERO_FACTS.map(({ value, label }) => (
              <div key={label}>
                <strong>{value}</strong>
                {label}
              </div>
            ))}
          </div>
        </div>
        <div className="stage">
          <svg viewBox="0 0 100 200" role="img" aria-label="Line drawing of a wine glass">
            <use href="#wine" />
            <rect className="shine" x="30" y="14" width="6" height="84" fill="#fff" opacity="0" transform="skewX(-12)" />
          </svg>
        </div>
      </div>
    </div>
  );
}
