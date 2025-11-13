"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SentimentGauge } from "@/components/sentiment-gauge-landing";
import { Check, TrendingUp } from "lucide-react";

export function AudioAlphaLanding() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setIsSubmitting(true);
    try {
      console.log("Submitting email:", email);
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      console.log("Server response:", data);
      if (response.ok) {
        setIsSubmitted(true);
        setEmail("");
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      console.error("❌ Submission error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      <div className="relative">
        {/* Header */}
        <header className="border-b border-slate-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AudioAlpha</span>
            </div>
            <div className="text-sm text-slate-400">Coming Soon</div>
          </div>
        </header>
        {/* Hero */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                <span className="text-sm font-medium text-cyan-400">
                  The Future of Crypto Sentiment Analysis
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Get Your Edge with{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Audio Intelligence
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-4">
                The only AI dashboard providing real-time sentiment insights from cryptocurrency podcasts
              </p>
              <div className="flex items-center justify-center gap-8 text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-mono text-cyan-400 font-semibold">
                    22,146
                  </span>{" "}
                  podcasts analyzed
                </div>
                <div>and counting...</div>
              </div>
            </div>
            {/* Gauges */}
            <div className="grid md:grid-cols-2 gap-8 mb-20">
              <div className="backdrop-blur-xl bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Bitcoin</h3>
                  <span className="text-sm text-slate-400">BTC</span>
                </div>
                <SentimentGauge value={72} crypto="BTC" />
                <div className="mt-6 pt-6 border-t border-slate-700/50 flex justify-between text-sm">
                  <span className="text-slate-400">24h Change</span>
                  <span className="text-green-400 font-medium">+8.3%</span>
                </div>
              </div>
              <div className="backdrop-blur-xl bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Ethereum</h3>
                  <span className="text-sm text-slate-400">ETH</span>
                </div>
                <SentimentGauge value={65} crypto="ETH" />
                <div className="mt-6 pt-6 border-t border-slate-700/50 flex justify-between text-sm">
                  <span className="text-slate-400">24h Change</span>
                  <span className="text-green-400 font-medium">+5.7%</span>
                </div>
              </div>
            </div>
            {/* Email Signup (now with reCAPTCHA) */}
            <div className="max-w-2xl mx-auto">
              <div className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-2xl p-8 md:p-12 shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-4 text-center">
                  Get Early Beta Access
                </h2>
                <p className="text-slate-300 text-center mb-8">
                  Join the waitlist and be the first to access AudioAlpha when we launch
                </p>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      You're on the list!
                    </h3>
                    <p className="text-slate-400">
                      We'll notify you when AudioAlpha launches.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 text-lg"
                        disabled={isSubmitting}
                      />
                      {error && (
                        <p className="text-red-400 text-sm mt-2">{error}</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-lg shadow-lg shadow-cyan-500/25"
                    >
                      {isSubmitting ? "Joining..." : "Join the Waitlist"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="border-t border-slate-800/50 py-8">
          <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
            <p>&copy; 2025 AudioAlpha. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
