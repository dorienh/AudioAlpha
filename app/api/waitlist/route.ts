import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    console.log("⚡ /api/waitlist POST called");
    const { email, token } = await request.json();
    console.log("📨 Received body:", body);

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Verify reCAPTCHA
    const recaptchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success || (recaptchaData.score ?? 0) < 0.5) {
      return NextResponse.json({ error: "reCAPTCHA verification failed" }, { status: 400 });
    }

    // Insert into Supabase
    const { error } = await supabase.from("waitlist").insert([{ email }]);
    if (error) throw error;

    console.log("[AudioAlpha Waitlist] New signup:", email);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[AudioAlpha Waitlist] Error:", err);
    return NextResponse.json({ error: "Failed to process signup" }, { status: 500 });
  }
}
