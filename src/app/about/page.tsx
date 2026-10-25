import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CheckCircleIcon } from "@/components/Icons";
import { mailto, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About ProQS New Zealand | Independent Quantity Surveyor",
  description:
    "Discover ProQS New Zealand, based in Ponsonby, Auckland, providing expert quantity surveying services for residential construction projects across New Zealand.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About ProQS New Zealand | Independent Quantity Surveyor",
    description:
      "Explore the story of ProQS New Zealand, your trusted independent quantity surveyor helping homeowners and builders navigate construction costs.",
  },
};

const reasons = [
  "Accurate cost estimates for new builds, renovations, and extensions across New Zealand.",
  "Independent advice to help you plan and budget your residential construction project.",
  "Clear, practical reports so you know what to expect before building begins.",
  "Expert review of builder quotes and tenders for peace of mind.",
  "Personalised service tailored to homeowners, builders, and architects.",
  "Fast turnaround and responsive support from an experienced professional.",
];

const highlights = [
  "Over 10 years’ residential expertise NZ-wide.",
  "Tailored support for homeowners and builders.",
  "Clear, reliable cost estimates every time.",
];

export default function About() {
  return (
    <>
      <section className="hero hero--bottom">
        <Image
          src="/images/murray-consulting.png"
          alt="Murray Bell reviewing building plans with the Auckland skyline behind"
          fill
          preload
          sizes="100vw"
          className="hero__bg"
        />
        <div className="hero__overlay" />
        <div className="container hero__content hero__content--stack">
          <h1 className="hero__title hero__title--md">Your trusted residential cost expert</h1>
          <p className="subheading">
            Independent quantity surveying for New Zealand homes. Clear, accurate estimates for homeowners, builders,
            and architects.
          </p>
          <ul className="tags">
            <li>Residential specialists</li>
            <li>Unbiased expertise</li>
            <li>Personalised support</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header is-center">
            <p className="eyebrow">Why choose us</p>
            <h2>
              Build with confidence,
              <br />
              <span className="text-muted">every time</span>
            </h2>
          </div>
          <ul className="reason-grid">
            {reasons.map((r) => (
              <li key={r}>
                <CheckCircleIcon className="reason-grid__icon" />
                <p>{r}</p>
              </li>
            ))}
          </ul>
          <div className="button-group is-center">
            <Link href="/contact" className="button button--primary">
              Contact us
            </Link>
            <a href={site.phoneHref} className="button button--outline">
              Call now
            </a>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <Image src="/images/blueprint.avif" alt="" fill sizes="100vw" className="cta-band__bg" />
        <div className="container">
          <div className="cta-card">
            <div>
              <h2>
                Ready to start
                <br />
                your project?
              </h2>
              <ul className="arrow-list">
                {highlights.map((h) => (
                  <li key={h}>
                    <ArrowRightIcon />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="button-group">
                <a href={mailto("Website Quote")} className="button button--primary">
                  Get a quote
                </a>
                <Link href="/contact" className="button button--outline">
                  Contact us
                </Link>
              </div>
            </div>
            <div className="cta-card__media">
              <Image src="/images/icon.png" alt="ProQS icon" width={1000} height={1000} sizes="(max-width: 767px) 80vw, 400px" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
