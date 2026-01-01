"use client";

import { useState } from "react";

export default function ConnectForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Portfolio message from ${name || "Visitor"}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:liumasn@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section className="terminal-card p-4">
      <h3 className="text-sm font-semibold">Let&apos;s Connect</h3>
      <p className="mt-2 text-sm text-[var(--color-subtext0)]">
        Send a note directly to <span className="text-[var(--color-accent)]">liumasn@gmail.com</span>.
      </p>
      <form className="mt-2 space-y-2" onSubmit={handleSubmit}>
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
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-[var(--color-accent)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-crust)] transition hover:brightness-110"
        >
          Email me
        </button>
      </form>
    </section>
  );
}
