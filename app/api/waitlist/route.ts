import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase client (using Vercel env vars)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Verify reCAPTCHA
    const recaptchaRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      { method: "POST" }
    );
    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return NextResponse.json({ error: "reCAPTCHA verification failed" }, { status: 400 });
    }

    // Insert into Supabase
    const { error } = await supabase.from("waitlist").insert([{ email }]);

    if (error) {
      console.error("[Supabase] Insert error:", error);
      return NextResponse.json({ error: "Failed to store email" }, { status: 500 });
    }

    console.log("[AudioAlpha Waitlist] New signup:", email, new Date().toISOString());
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[AudioAlpha Waitlist] Error:", error);
    return NextResponse.json({ error: "Failed to process signup" }, { status: 500 });
  }
}
