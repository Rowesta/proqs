"use client";

import Image from "next/image";
import { useState } from "react";
import { testimonials } from "@/lib/site";

export default function Testimonials() {
  const [active, setActive] = useState(testimonials.length - 1);

  return (
    <div className="testimonials">
      <div className="testimonials__panels">
        {testimonials.map((t, i) => (
          <div
            key={t.name}
            id={`testimonial-${i}`}
            role="tabpanel"
            hidden={i !== active}
            className="testimonials__panel"
          >
            <div className="ratio-4x3">
              <Image src={t.image} alt="" fill sizes="(max-width: 767px) 100vw, 50vw" />
            </div>
            <figure>
              <blockquote className="quote">“{t.quote}”</blockquote>
              <figcaption>
                <div className="author-name">{t.name}</div>
                <div className="author-info">{t.role}</div>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>
      <div className="testimonials__tabs" role="tablist" aria-label="Client testimonials">
        {testimonials.map((t, i) => (
          <button
            key={t.name}
            role="tab"
            aria-selected={i === active}
            aria-controls={`testimonial-${i}`}
            className={`testimonials__tab${i === active ? " is-active" : ""}`}
            onClick={() => setActive(i)}
          >
            <span className="avatar">
              <Image src={t.avatar} alt="" width={96} height={96} />
            </span>
            <span>
              <strong>{t.name}</strong>
              <br />
              {t.role}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
