"use client";
import { useState } from "react";
export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  async function handleSubmit(e: React.FormEvent) {
    console.log("handleSubmit called")
    e.preventDefault();
    setStatus("Submitting...");
    try {
      console.log("Submitting email:", email);
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), // No token
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
      {/* Comment out reCAPTCHA script */}
      {/* <script src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_KEY}`} /> */}
    </form>
  );
}
