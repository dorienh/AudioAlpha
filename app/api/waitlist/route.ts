import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Log the email to console - you can replace this with your email service
    console.log("[AudioAlpha Waitlist] New signup:", email, new Date().toISOString())

    // TODO: Add your email service integration here
    // Examples:
    // - Send to your email via SendGrid, Resend, etc.
    // - Store in database
    // - Add to mailing list service

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[AudioAlpha Waitlist] Error:", error)
    return NextResponse.json({ error: "Failed to process signup" }, { status: 500 })
  }
}
