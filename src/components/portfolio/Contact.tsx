const contacts = [
  {
    label: "Email",
    value: "liumasn@gmail.com",
    href: "mailto:liumasn@gmail.com",
  },
  {
    label: "GitHub",
    value: "github.com/masonliiu",
    href: "https://github.com/masonliiu",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/masonliiu",
    href: "https://www.linkedin.com/in/masonliiu/",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-24">
      <div className="terminal-title">Contact</div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">Let’s talk</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {contacts.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            className="terminal-card flex flex-col gap-2 p-5 text-sm transition hover:border-[var(--accent)]"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
              {contact.label}
            </span>
            <span className="text-sm font-semibold text-[var(--text)]">
              {contact.value}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
