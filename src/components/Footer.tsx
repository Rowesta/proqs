import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import Year from "./Year";

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQs", href: "/contact#faqs" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <ul className="footer__links">
          {links.map((l) => (
            <li key={l.label}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <Link href="/" className="footer__logo" aria-label="ProQS home">
          <Image src="/images/logo-white.png" alt="ProQS New Zealand" width={500} height={239} />
        </Link>
        <div className="footer__bottom">
          <span>
            © <Year /> {site.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
