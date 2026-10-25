import type { Metadata } from "next";
import { Instrument_Sans, Onest } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import RevealOnScroll from "@/components/RevealOnScroll";
import { site } from "@/lib/site";
import "./globals.css";

const onest = Onest({
  variable: "--font-heading",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "ProQS New Zealand - Accurate Construction Cost Estimates in Auckland",
    template: "%s",
  },
  description:
    "Get reliable construction cost estimates for residential projects in New Zealand with ProQS. Specializing in new builds, renovations, and extensions.",
  openGraph: {
    siteName: site.name,
    locale: "en_NZ",
    type: "website",
    images: ["/images/murray-consulting.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: site.url,
  email: site.email,
  telephone: site.phoneDisplay,
  image: `${site.url}/images/logo-blue.png`,
  founder: { "@type": "Person", name: site.contactName, jobTitle: "Registered Quantity Surveyor" },
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.suburb,
    addressRegion: site.address.city,
    addressCountry: "NZ",
  },
  areaServed: "New Zealand",
  openingHours: "Mo-Fr 08:00-17:00",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NZ" className={`${onest.variable} ${instrumentSans.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <RevealOnScroll />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
