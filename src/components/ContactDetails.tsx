import { mailto, site } from "@/lib/site";
import { ChatIcon, MailIcon, PinIcon } from "./Icons";

type Props = {
  layout?: "row" | "stack";
  emailNote?: string;
};

export default function ContactDetails({ layout = "row", emailNote = "Send your plans or questions anytime." }: Props) {
  const items = [
    {
      icon: <MailIcon />,
      title: "Email",
      note: emailNote,
      label: site.email,
      href: mailto("Website Enquiry"),
    },
    {
      icon: <ChatIcon />,
      title: "Phone",
      note: `Available ${site.hours.toLowerCase()}.`,
      label: site.phoneDisplay,
      href: site.phoneHref,
    },
    {
      icon: <PinIcon />,
      title: layout === "row" ? "Office" : "Location",
      note: layout === "row" ? "Visit us at our office located at:" : "Visit our Belmont, Auckland office.",
      label: `${site.address.street}, ${site.address.suburb} ${site.address.city}`,
      href: site.mapsHref,
      external: true,
    },
  ];

  return (
    <ul className={`contact-list contact-list--${layout}`}>
      {items.map((i) => (
        <li key={i.title} className="contact-item">
          <span className="icon-tile">{i.icon}</span>
          <div>
            <h3 className="contact-item__title">{i.title}</h3>
            <p className="contact-item__note">{i.note}</p>
            <a
              className="contact-item__link"
              href={i.href}
              {...(i.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {i.label}
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
