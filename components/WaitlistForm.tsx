"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Load reCAPTCHA script
  useEffect(() => {
    if (!window.grecaptcha) {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_KEY}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await new Promise<string>((resolve, reject) => {
        if (!window.grecaptcha) return reject(new Error("reCAPTCHA not loaded"));
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_KEY!, { action: "submit" })
            .then(resolve)
            .catch(reject);
        });
      });

      console.log("🧩 reCAPTCHA token:", token.slice(0, 20) + "...");

      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      console.log("Fetch response status:", response.status);
      const data = await response.json();
      console.log("Server response data:", data);

      if (response.ok) {
        setIsSubmitted(true);
        setEmail("");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err: any) {
      console.error("Fetch/grecaptcha error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {isSubmitted ? (
        <p>✅ You’re on the waitlist!</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
          {error && <p className="text-red-400">{error}</p>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Joining..." : "Join the Waitlist"}
          </Button>
        </form>
      )}
    </div>
  );
}
