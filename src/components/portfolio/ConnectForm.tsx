"use client";

import { useState } from "react";

export default function ConnectForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Portfolio message from ${name || "Visitor"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    window.location.href = `mailto:liumasn@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section className="terminal-card p-4">
      <h3 className="text-sm font-semibold">Let&apos;s Connect</h3>
      <p className="mt-2 text-sm text-[var(--color-subtext0)]">
        Send a message directly to <span className="text-[var(--color-accent)]">liumasn@gmail.com</span>.
      </p>
      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <label className="block text-xs text-[var(--color-subtext1)]">
          Name
          <input
            className="mt-1 w-full rounded-md border border-[var(--color-surface1)] bg-transparent px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
          />
        </label>
        <label className="block text-xs text-[var(--color-subtext1)]">
          Email
          <input
            className="mt-1 w-full rounded-md border border-[var(--color-surface1)] bg-transparent px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label className="block text-xs text-[var(--color-subtext1)]">
          Message
          <textarea
            className="mt-1 min-h-[120px] w-full rounded-md border border-[var(--color-surface1)] bg-transparent px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="What should I know?"
          />
        </label>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-[color-mix(in srgb,var(--color-accent) 80%,transparent)] px-3 py-2 text-sm font-semibold text-[var(--color-crust)] transition hover:bg-[var(--color-accent)]"
        >
          Send email
        </button>
      </form>
    </section>
  );
}
