"use client";

import type { FormEvent } from "react";
import { CONTACT_DETAILS, PRODUCT_OPTIONS, waLink } from "../content";

export function QuoteSection() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = [
      "Hi, I need a quote.",
      `Name: ${data.get("name")}`,
      `Product: ${data.get("product")}`,
      `Quantity: ${data.get("quantity")}`,
      `City: ${data.get("city")}`,
      `Phone: ${data.get("phone")}`,
    ].join("\n");
    window.open(waLink(text), "_blank", "noopener,noreferrer");
  };

  return (
    <section className="contact" id="quote">
      <div className="wrap">
        <div>
          <h2>Get a quote within a day</h2>
          <p className="lede">Tell us what you need. We reply on WhatsApp or phone with pricing and samples.</p>
          <ul>
            {CONTACT_DETAILS.map(({ label, value }) => (
              <li key={label}>
                <b>{label}</b> &nbsp; {value}
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input name="name" required autoComplete="name" />
          </label>
          <label>
            Phone
            <input name="phone" type="tel" required autoComplete="tel" />
          </label>
          <label>
            Product
            <select name="product">
              {PRODUCT_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            Quantity
            <input name="quantity" placeholder="e.g. 500 pcs" />
          </label>
          <label className="full">
            City
            <input name="city" autoComplete="address-level2" />
          </label>
          <button className="btn gold" type="submit">
            Send enquiry on WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}
