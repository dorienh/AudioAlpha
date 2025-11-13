export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();

    console.log("🔍 Incoming email:", email);
    console.log("🔍 Token received (first 20 chars):", token?.slice(0, 20));
    console.log("🔍 reCAPTCHA secret set:", !!process.env.RECAPTCHA_SECRET_KEY);

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.append("secret", process.env.RECAPTCHA_SECRET_KEY!);
    params.append("response", token);

    const recaptchaRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      }
    );

    const recaptchaData = await recaptchaRes.json();
    console.log("🔍 reCAPTCHA response:", recaptchaData);

    if (!recaptchaData.success) {
      return NextResponse.json(
        { error: "reCAPTCHA failed", details: recaptchaData },
        { status: 400 }
      );
    }

    // Supabase insert...
    const { error } = await supabase.from("waitlist").insert([{ email }]);
    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to store email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
