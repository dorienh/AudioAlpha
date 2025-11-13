"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      // Ensure reCAPTCHA is loaded
      if (!window.grecaptcha) {
        setStatus("reCAPTCHA not loaded");
        return;
      }

      // Get the token from reCAPTCHA v3
      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_KEY!,
        { action: "submit" }
      );

      console.log("reCAPTCHA token:", token.slice(0, 20) + "...");

      // Send email + token to your route
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (res.ok) setStatus("✅ Signed up successfully!");
      else setStatus(`❌ ${data.error || "Unknown error"}`);
    } catch (err) {
      console.error("Waitlist error:", err);
      setStatus("Error submitting");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Join Waitlist</button>
      <p>{status}</p>

      {/* reCAPTCHA script (must include this in your page or _app.tsx) */}
      <script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_KEY}`}
      />
    </form>
  );
}
