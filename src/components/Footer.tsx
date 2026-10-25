import Image from "next/image";
import Link from "next/link";
import { mailto, quoteHref, site } from "@/lib/site";
import Year from "./Year";

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQs", href: "/contact#faqs" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link href="/" className="footer__logo" aria-label="ProQS home">
              <Image src="/brand/proqs-logo-white.svg" alt="ProQS New Zealand" width={767} height={196} />
            </Link>
            <p>
              Independent residential quantity surveying by {site.contactName}, Registered Quantity Surveyor.
            </p>
            <Link href={quoteHref} className="button button--primary">
              Send your plans
            </Link>
          </div>

          <div>
            <h2 className="footer__heading">Explore</h2>
            <ul className="footer__links">
              {links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="footer__heading">Contact</h2>
            <ul className="footer__links">
              <li>
                <a href={mailto("Website Enquiry")}>{site.email}</a>
              </li>
              <li>
                <a href={site.phoneHref}>{site.phoneDisplay}</a>
              </li>
              <li>
                <a href={site.mapsHref} target="_blank" rel="noopener noreferrer">
                  {site.address.street}
                  <br />
                  {site.address.suburb}, {site.address.city}
                </a>
              </li>
              <li className="footer__muted">{site.hours}</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © <Year /> {site.name}
          </span>
          {site.memberships.length > 0 && <span>{site.memberships.join(" · ")}</span>}
        </div>
      </div>
    </footer>
  );
}
