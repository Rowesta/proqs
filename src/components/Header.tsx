"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { quoteHref, services } from "@/lib/site";
import { ChevronDownIcon, CloseIcon, MenuIcon } from "./Icons";

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
          <Image src="/brand/proqs-logo.svg" alt="ProQS New Zealand" width={767} height={196} preload />
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
              <div id="services-menu" className={`dropdown${servicesOpen ? " is-open" : ""}`}>
                <ul>
                  {services.map((s) => (
                    <li key={s.id}>
                      <Link href={`/#${s.id}`} className="dropdown__link" onClick={close}>
                        {s.title}
                      </Link>
                    </li>
                  ))}
                  <li className="dropdown__divider">
                    <Link href="/#how-it-works" className="dropdown__link" onClick={close}>
                      How it works
                    </Link>
                  </li>
                </ul>
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
          <Link href={quoteHref} className="button button--primary nav__cta" onClick={close}>
            Send your plans
          </Link>
        </nav>
      </div>
    </header>
  );
}
