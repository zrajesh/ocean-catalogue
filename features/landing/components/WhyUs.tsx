import { WHY_US } from "../content";

export function WhyUs() {
  return (
    <section className="why" id="why">
      <div className="wrap">
        <div className="head">
          <h2>Built for businesses that buy in volume</h2>
          <p>Clear terms, so you can plan stock and budgets without chasing quotes.</p>
        </div>
        <div className="grid4">
          {WHY_US.map(({ title, body }) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
