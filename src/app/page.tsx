import Image from "next/image";
import Link from "next/link";
import ContactDetails from "@/components/ContactDetails";
import EstimateCard from "@/components/EstimateCard";
import HouseMark from "@/components/HouseMark";
import { CheckCircleIcon } from "@/components/Icons";
import { audiences, credentials, quoteHref, services, site, steps, testimonial } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: "ProQS New Zealand - Accurate Construction Cost Estimates in Auckland",
    description:
      "Discover how ProQS can help you with accurate cost estimates for your residential construction projects across New Zealand.",
  },
};

export default function Home() {
  const [lead, ...rest] = services;

  return (
    <>
      <section className="hero-split">
        <div className="hero-split__media">
          <Image
            src="/images/murray-consulting.png"
            alt="Murray Bell reviewing building plans, with the Auckland skyline behind"
            fill
            preload
            sizes="(max-width: 991px) 100vw, 55vw"
          />
        </div>
        <div className="hero-split__content">
          <HouseMark draw className="hero-split__mark" />
          <p className="eyebrow eyebrow--light">Independent quantity surveyor · Auckland</p>
          <h1 className="hero__title">Build with cost clarity</h1>
          <p className="subheading">
            Accurate construction estimates for your next home build, renovation, or extension. Get practical advice
            and budget certainty before you start.
          </p>
          <div className="button-group">
            <Link href={quoteHref} className="button button--primary button--large">
              Send your plans for a quote
            </Link>
            <Link href="#how-it-works" className="button button--ghost-light button--large">
              How it works
            </Link>
          </div>
          <EstimateCard />
        </div>
      </section>

      <section className="credentials" aria-label="At a glance">
        <ul className="container credentials__list">
          {[...credentials, ...site.memberships.map((m) => ({ value: m, label: "Professional membership" }))].map(
            (c) => (
              <li key={c.value}>
                <strong>{c.value}</strong>
                <span>{c.label}</span>
              </li>
            ),
          )}
        </ul>
      </section>

      <section className="section">
        <div className="container split split--intro">
          <div data-reveal>
            <p className="eyebrow">What a quantity surveyor does</p>
            <h2>Know what it will cost before you commit</h2>
          </div>
          <div data-reveal>
            <p className="lead">
              A quantity surveyor measures your plans and prices every part of the build — materials, labour,
              and the details that are easy to miss — so you know the real cost before construction starts.
            </p>
            <p className="text-muted">
              A builder&apos;s quote is prepared to win the job. An independent estimate is prepared for you, so
              you can set a realistic budget, compare quotes fairly and spot gaps before you sign.
            </p>
            <ul className="audience-list">
              {audiences.map((a) => (
                <li key={a.title}>
                  <CheckCircleIcon />
                  <div>
                    <strong>{a.title}</strong>
                    <p>{a.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="services" className="section section--secondary">
        <div className="container">
          <div className="section-header" data-reveal>
            <p className="eyebrow">Our core services</p>
            <h2>Expert cost advice, every time</h2>
          </div>
          <div className="services">
            <article id={lead.id} className="card card--lead" data-reveal>
              <div className="card__media">
                <Image src={lead.image} alt={lead.alt} fill sizes="(max-width: 991px) 100vw, 60vw" />
              </div>
              <div className="card__body">
                <p className="eyebrow">Start here</p>
                <h3>{lead.title}</h3>
                <p>{lead.body}</p>
                <ServiceMeta from={lead.from} turnaround={lead.turnaround} />
                <Link href={quoteHref} className="button button--primary">
                  Get an estimate
                </Link>
              </div>
            </article>
            {rest.map((s) => (
              <article key={s.id} id={s.id} className="card" data-reveal>
                <div className="card__media">
                  <Image src={s.image} alt={s.alt} fill sizes="(max-width: 767px) 100vw, 33vw" />
                </div>
                <div className="card__body">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <ServiceMeta from={s.from} turnaround={s.turnaround} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section">
        <div className="container">
          <div className="section-header" data-reveal>
            <p className="eyebrow">How it works</p>
            <h2>Three simple steps</h2>
          </div>
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s.title} data-reveal>
                <span className="steps__num">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="button-group" data-reveal>
            <Link href={quoteHref} className="button button--primary button--large">
              Send your plans
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--secondary">
        <div className="container split split--center">
          <div className="ratio-4x3" data-reveal>
            <Image src={testimonial.image} alt="" fill sizes="(max-width: 767px) 100vw, 50vw" />
          </div>
          <figure className="testimonial" data-reveal>
            <p className="eyebrow">Clients trust our expertise</p>
            <blockquote className="quote">“{testimonial.quote}”</blockquote>
            <figcaption className="testimonial__author">
              <span className="avatar">
                <Image src={testimonial.avatar} alt="" width={96} height={96} />
              </span>
              <span>
                <span className="author-name">{testimonial.name}</span>
                <span className="author-info">{testimonial.role}</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section section--navy section--mark">
        <div className="section__watermark" data-reveal>
          <HouseMark draw outline />
        </div>
        <div className="container">
          <div className="section-header is-center" data-reveal>
            <p className="eyebrow eyebrow--light">Get started</p>
            <h2>
              Send your plans to
              <br />
              {site.contactName} (Reg QS)
            </h2>
            <p className="subheading">
              Upload your drawings for a detailed, independent cost estimate — or get in touch with a question.
            </p>
            <div className="button-group is-center">
              <Link href={quoteHref} className="button button--primary button--large">
                Send your plans for a quote
              </Link>
            </div>
          </div>
          <ContactDetails layout="row" />
        </div>
      </section>
    </>
  );
}

function ServiceMeta({ from, turnaround }: { from?: string; turnaround?: string }) {
  if (!from && !turnaround) return null;
  return (
    <ul className="card__meta">
      {from && <li>{from}</li>}
      {turnaround && <li>{turnaround}</li>}
    </ul>
  );
}
