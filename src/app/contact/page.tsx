import type { Metadata } from "next";
import Image from "next/image";
import ContactDetails from "@/components/ContactDetails";
import { CheckCircleIcon, ChevronDownIcon } from "@/components/Icons";
import { faqs, mailto } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact ProQS New Zealand | Quantity Surveyor in Ponsonby",
  description:
    "Contact ProQS New Zealand today for reliable cost estimates and construction advice. Reach us via phone or email.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact ProQS New Zealand | Quantity Surveyor in Ponsonby",
    description:
      "Reach out to ProQS New Zealand for your construction cost needs. We’re here to assist you with accurate estimates and advice.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Contact() {
  return (
    <>
      <section className="section section--secondary section--top">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Contact details</p>
            <h1 className="h2">Connect with a cost expert</h1>
            <p className="subheading">
              Reach out for accurate estimates or advice. We&apos;re here to help with your residential project.
            </p>
          </div>
          <div className="split">
            <ContactDetails layout="stack" emailNote="Get prompt responses to your queries." />
            <div className="ratio-portrait">
              <Image
                src="/images/contact-header.png"
                alt="Murray Bell on a residential building site"
                fill
                preload
                sizes="(max-width: 767px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="faqs" className="section">
        <div className="container container--sm">
          <div className="section-header">
            <h2>Your questions, answered</h2>
            <p className="subheading">Quick answers about our estimating process.</p>
          </div>
          <div className="faq">
            {faqs.map((f, i) => (
              <details key={f.q} className="faq__item" open={i === 0}>
                <summary>
                  {f.q}
                  <ChevronDownIcon className="faq__chevron" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <p className="faq__more">
            Need more help? <a href={mailto("Website Enquiry")}>Get in touch with us.</a>
          </p>
        </div>
      </section>

      <section className="section section--secondary">
        <div className="container split split--center">
          <div>
            <span className="icon-tile">
              <CheckCircleIcon />
            </span>
            <h2>Contact a trusted cost expert</h2>
            <p className="subheading">
              Reach out for accurate estimates, practical advice, or to discuss your residential project.
              We&apos;re ready to assist.
            </p>
            <div className="button-group">
              <a href={mailto("Website Enquiry")} className="button button--primary">
                Email Murray
              </a>
            </div>
          </div>
          <div className="ratio-4x3">
            <Image
              src="/images/contact-villa.jpg"
              alt="Restored Auckland villa"
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
