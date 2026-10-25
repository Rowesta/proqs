import type { Metadata } from "next";
import ContactDetails from "@/components/ContactDetails";
import { ChevronDownIcon, MailIcon } from "@/components/Icons";
import QuoteForm from "@/components/QuoteForm";
import { faqs, mailto, site, steps } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact ProQS New Zealand | Quantity Surveyor in Belmont, Auckland",
  description:
    "Send your plans to ProQS New Zealand for a reliable residential cost estimate, or contact Murray Bell by phone or email.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact ProQS New Zealand | Quantity Surveyor in Belmont, Auckland",
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

// The upload form only appears once storage and email are configured (see README).
// Until then visitors get a plain "email your plans" panel instead of a form that can't send.
const formEnabled = Boolean(
  process.env.BLOB_READ_WRITE_TOKEN && process.env.RESEND_API_KEY && process.env.QUOTE_FROM_EMAIL,
);

export default function Contact() {
  return (
    <>
      <section id="quote" className="section section--secondary section--top">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Get a quote</p>
            <h1 className="h2">Send your plans for an independent estimate</h1>
            <p className="subheading">
              Upload your drawings and a few details. Murray will review them and confirm your timeline — most
              estimates are ready within 3–5 business days.
            </p>
          </div>
          <div className="contact-layout">
            <div className="panel">
              {formEnabled ? (
                <QuoteForm />
              ) : (
                <div className="email-plans">
                  <span className="icon-tile">
                    <MailIcon />
                  </span>
                  <h2 className="email-plans__title">Email your plans to Murray</h2>
                  <p>
                    Attach your drawings (PDF, images or CAD files) and include a few details: the project
                    type, location, and roughly where you are in the design process.
                  </p>
                  <a href={mailto("Plans for a quote")} className="button button--primary button--large">
                    Email {site.email}
                  </a>
                  <p className="form-note">
                    Files too large to email? Share a Dropbox or Google Drive link, or call Murray on{" "}
                    <a href={site.phoneHref}>{site.phoneDisplay}</a>.
                  </p>
                </div>
              )}
            </div>
            <aside className="contact-aside">
              <h2 className="contact-aside__title">Prefer to talk first?</h2>
              <ContactDetails layout="stack" emailNote="Get prompt responses to your queries." />
              <div className="contact-aside__steps">
                <h3>What happens next</h3>
                <ol>
                  {steps.map((s) => (
                    <li key={s.title}>{s.title}</li>
                  ))}
                </ol>
              </div>
            </aside>
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
