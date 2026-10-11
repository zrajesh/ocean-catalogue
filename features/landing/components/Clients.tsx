import { CLIENTS } from "../content";

export function Clients() {
  return (
    <section id="clients">
      <div className="wrap">
        <div className="head">
          <h2>Who we supply</h2>
        </div>
        <div className="who">
          {CLIENTS.map((client) => (
            <span key={client}>{client}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
