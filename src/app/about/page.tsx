import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CheckCircleIcon } from "@/components/Icons";
import { quoteHref, site } from "@/lib/site";

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
      <section className="page-hero">
        <div className="container split split--center">
          <div>
            <p className="eyebrow">About ProQS</p>
            <h1 className="page-hero__title">Your trusted residential cost expert</h1>
            <p className="subheading">
              Independent quantity surveying for New Zealand homes. Clear, accurate estimates for homeowners,
              builders, and architects.
            </p>
            <ul className="tags">
              <li>Residential specialists</li>
              <li>Unbiased expertise</li>
              <li>Personalised support</li>
            </ul>
          </div>
          <div className="ratio-portrait">
            <Image
              src="/images/contact-header.png"
              alt="Murray Bell on a residential building site"
              fill
              preload
              sizes="(max-width: 767px) 100vw, 45vw"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--sm" data-reveal>
          <p className="eyebrow">Meet Murray</p>
          <h2>One expert, start to finish</h2>
          <div className="prose">
            <p className="lead">
              ProQS is {site.contactName}, a Registered Quantity Surveyor based in Ponsonby, Auckland, with more
              than ten years of experience pricing residential construction across New Zealand.
            </p>
            <p>
              When you work with ProQS, you deal with Murray directly — from the first look at your plans to
              talking through the final numbers. There&apos;s no hand-off to a junior and no sales pitch: just
              independent, practical cost advice so you can plan your build with confidence.
            </p>
            <p>
              Murray works with homeowners planning a new home or renovation, builders who want independent
              numbers behind their pricing, and architects checking designs against a client&apos;s budget.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--secondary">
        <div className="container">
          <div className="section-header is-center" data-reveal>
            <p className="eyebrow">Why choose us</p>
            <h2>
              Build with confidence,
              <br />
              <span className="text-muted">every time</span>
            </h2>
          </div>
          <ul className="reason-grid" data-reveal>
            {reasons.map((r) => (
              <li key={r}>
                <CheckCircleIcon className="reason-grid__icon" />
                <p>{r}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cta-band">
        <Image src="/images/blueprint.avif" alt="" fill sizes="100vw" className="cta-band__bg" />
        <div className="container">
          <div className="cta-card" data-reveal>
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
                <Link href={quoteHref} className="button button--primary button--large">
                  Send your plans for a quote
                </Link>
                <a href={site.phoneHref} className="button button--outline button--large">
                  Call Murray
                </a>
              </div>
            </div>
            <div className="cta-card__media">
              <Image src="/brand/proqs-mark-white.svg" alt="" width={279} height={196} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
