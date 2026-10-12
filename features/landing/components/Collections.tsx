import { COLLECTIONS } from "../content";
import { PdfPreloader } from "./PdfPreloader";

export function Collections() {
  return (
    <section id="products">
      <PdfPreloader targetId="products" />
      <div className="wrap">
        <div className="head">
          <h2>Browse by collection</h2>
          <p>Open any collection as a PDF with sizes, capacities and bulk prices.</p>
        </div>
        <div className="grid4">
          {COLLECTIONS.map(({ icon, viewBox, title, blurb, pdf }) => (
            <div className="cat" key={icon}>
              <div className="art">
                <svg viewBox={viewBox} aria-hidden="true">
                  <use href={`#${icon}`} />
                </svg>
              </div>
              <div className="body">
                <h3>{title}</h3>
                <p>{blurb}</p>
                <a className="pdf" href={pdf}>
                  <span>View PDF</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
