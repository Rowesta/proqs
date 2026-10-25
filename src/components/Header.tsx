"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mailto, site } from "@/lib/site";
import { ChevronDownIcon, CloseIcon, MenuIcon } from "./Icons";

const megaMenu = [
  {
    heading: "Cost Estimates",
    links: [
      { label: "Residential Builds", desc: "Accurate pricing for new home projects.", href: "/#services" },
      { label: "Renovations", desc: "Detailed estimates for home upgrades.", href: "/#services" },
      { label: "Extensions", desc: "Budgeting for home additions.", href: "/#services" },
    ],
  },
  {
    heading: "Planning & Advice",
    links: [
      { label: "Feasibility Reports", desc: "Assess project costs before you build.", href: "/#services" },
      { label: "Budget Advice", desc: "Guidance for new builds and renovations.", href: "/#services" },
      { label: "Tender Review", desc: "Independent review of builder quotes.", href: "/#services" },
    ],
  },
  {
    heading: "About & Contact",
    links: [
      { label: "About", desc: "Learn about our experience and approach.", href: "/about" },
      { label: "Contact", desc: "Get in touch for a quote.", href: "/contact" },
      { label: "Location", desc: "Based in Ponsonby, Auckland.", href: site.mapsHref },
    ],
  },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement>(null);

  // Close menus on navigation (incl. back/forward)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setServicesOpen(false);
  }

  useEffect(() => {
    if (!servicesOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setServicesOpen(false);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [servicesOpen]);

  const close = () => {
    setMenuOpen(false);
    setServicesOpen(false);
  };

  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link href="/" className="nav__logo" aria-label="ProQS home">
          <Image src="/images/logo-blue.png" alt="ProQS New Zealand" width={500} height={239} preload />
        </Link>

        <button
          className="nav__toggle"
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <nav id="nav-menu" className={`nav__menu${menuOpen ? " is-open" : ""}`}>
          <ul className="nav__links">
            <li className="nav__dropdown" ref={servicesRef}>
              <button
                className="nav__link"
                aria-expanded={servicesOpen}
                aria-controls="services-menu"
                onClick={() => setServicesOpen((o) => !o)}
              >
                Services <ChevronDownIcon className={`nav__chevron${servicesOpen ? " is-open" : ""}`} />
              </button>
              <div id="services-menu" className={`mega${servicesOpen ? " is-open" : ""}`}>
                <div className="container mega__inner">
                  {megaMenu.map((col) => (
                    <div key={col.heading} className="mega__col">
                      <div className="eyebrow">{col.heading}</div>
                      <ul>
                        {col.links.map((l) => (
                          <li key={l.label}>
                            <Link href={l.href} className="mega__link" onClick={close}>
                              <span className="mega__label">{l.label}</span>
                              <span className="mega__desc">{l.desc}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <a className="mega__cta" href={mailto("Plans for a quote")}>
                    <span className="mega__cta-title">Send your plans for a quote</span>
                    <span className="mega__desc">
                      Email your drawings to receive a detailed, independent cost estimate for your project.
                    </span>
                    <span className="button button--primary button--small">Send plans</span>
                  </a>
                </div>
              </div>
            </li>
            <li>
              <Link href="/about" className="nav__link" aria-current={pathname === "/about" ? "page" : undefined}>
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="nav__link" aria-current={pathname === "/contact" ? "page" : undefined}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
