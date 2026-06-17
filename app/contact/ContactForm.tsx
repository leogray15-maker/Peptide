"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to backend email handler or Formspree/Resend
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="p-8 rounded-xl text-center"
        style={{ background: "rgba(46,204,113,0.08)", border: "1px solid rgba(46,204,113,0.3)" }}
      >
        <p className="text-2xl mb-2">✓</p>
        <p className="font-bold mb-1">Message Sent</p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          We&apos;ll get back to you within one working day.
        </p>
      </div>
    );
  }

  const input: React.CSSProperties = {
    width: "100%",
    background: "var(--surface-2)",
    border: "1px solid var(--line-med)",
    borderRadius: "var(--radius-md)",
    color: "var(--text)",
    padding: "10px 14px",
    fontSize: "14px",
    outline: "none",
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="label-upper block mb-1.5">Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dr. Jane Smith"
          style={input}
        />
      </div>
      <div>
        <label className="label-upper block mb-1.5">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@institution.ac.uk"
          style={input}
        />
      </div>
      <div>
        <label className="label-upper block mb-1.5">Message</label>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your research enquiry…"
          rows={5}
          style={input}
        />
      </div>
      <Button type="submit" disabled={!name || !email || !message}>
        Send Message
      </Button>
    </form>
  );
}
