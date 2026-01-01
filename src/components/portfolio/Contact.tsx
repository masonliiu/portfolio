const contacts = [
  {
    label: "Email",
    value: "mason@example.com",
    href: "mailto:mason@example.com",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/masonliu",
    href: "https://linkedin.com",
  },
  {
    label: "GitHub",
    value: "github.com/masonliu",
    href: "https://github.com",
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
        Contact
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-slate-900">
        Let’s build something thoughtful
      </h2>
      <p className="mt-3 max-w-xl text-sm text-slate-600">
        Open to new opportunities, collaborations, and consulting. Reach out and
        I’ll respond within two business days.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {contacts.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            className="rounded-2xl border border-slate-200 px-4 py-5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {contact.label}
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-800">
              {contact.value}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
