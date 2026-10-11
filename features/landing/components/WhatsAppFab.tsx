import { waLink } from "../content";

export function WhatsAppFab() {
  return (
    <a className="wa" href={waLink()} aria-label="Chat on WhatsApp">
      WhatsApp us
    </a>
  );
}
