import Image from "next/image";
import Link from "next/link";
import ContactDetails from "@/components/ContactDetails";
import Testimonials from "@/components/Testimonials";
import { services, site } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: "ProQS New Zealand - Accurate Construction Cost Estimates in Auckland",
    description:
      "Discover how ProQS can help you with accurate cost estimates for your residential construction projects across New Zealand.",
  },
};

export default function Home() {
  return (
    <>
      <section className="hero">
        <Image
          src="/images/hero-home.avif"
          alt=""
          fill
          preload
          sizes="100vw"
          className="hero__bg"
        />
        <div className="hero__overlay" />
        <div className="container hero__content">
          <h1 className="hero__title">Build with cost clarity</h1>
          <div className="hero__aside">
            <p className="subheading">
              Accurate construction estimates for your next home build, renovation, or extension. Get practical
              advice and budget certainty before you start.
            </p>
            <div className="button-group">
              <Link href="/contact" className="button button--primary">
                Contact
              </Link>
              <Link href="/about" className="button button--outline-light">
                About ProQS
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="section section--secondary">
        <div className="container">
          <div className="section-header is-center">
            <p className="eyebrow">Our core services</p>
            <h2>Expert cost advice, every time</h2>
          </div>
          <ul className="card-grid">
            {services.map((s) => (
              <li key={s.title} className="card">
                <div className="ratio-3x2">
                  <Image src={s.image} alt={s.alt} fill sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 25vw" />
                </div>
                <div className="card__body">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header is-center">
            <h2>Clients trust our expertise</h2>
            <p className="subheading">
              Hear from homeowners and builders who relied on our cost estimates for their residential projects.
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      <section className="section section--accent">
        <div className="container">
          <div className="section-header is-center">
            <p className="eyebrow">Contact details</p>
            <h2>
              Connect with
              <br />
              {site.contactName} (Reg QS)
            </h2>
            <p className="subheading">
              Reach out for cost estimates or advice. We&apos;re here to help with your residential project.
            </p>
          </div>
          <ContactDetails layout="row" />
        </div>
      </section>
    </>
  );
}
