import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role if needed
);

export async function POST(request: Request) {
  try {
    console.log("⚡ /api/waitlist POST called");

    const body = await request.json();
    console.log("📨 Received body:", body);

    const { email, token } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!token) {
      return NextResponse.json({ error: "Missing reCAPTCHA token" }, { status: 400 });
    }

    // Verify reCAPTCHA
    const params = new URLSearchParams();
    params.append("secret", process.env.RECAPTCHA_SECRET_KEY!);
    params.append("response", token);

    const recaptchaRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }
    );

    const recaptchaData = await recaptchaRes.json();
    console.log("✅ reCAPTCHA response:", recaptchaData);

    if (!recaptchaData.success || (recaptchaData.score ?? 0) < 0.5) {
      return NextResponse.json({ error: "reCAPTCHA verification failed", details: recaptchaData }, { status: 400 });
    }

    // Insert email into Supabase
    const { error } = await supabase.from("waitlist").insert([{ email }]);
    if (error) throw error;

    console.log("🎉 New waitlist signup:", email);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("🔥 Waitlist POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
