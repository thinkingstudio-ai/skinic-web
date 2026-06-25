import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, email, website, useCase, volume, message } = body;

    if (!name || !company || !email || !useCase) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await resend.emails.send({
      from: "SKINIC Enterprise <onboarding@resend.dev>",
      to: ["admin.thinkingstudio@gmail.com"],
      replyTo: email,
      subject: `Enterprise Inquiry — ${company}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #7c3aed; margin-bottom: 4px;">New Enterprise Inquiry</h2>
          <p style="color: #888; font-size: 13px; margin-top: 0;">via skinic.app/enterprise</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #555; width: 140px; font-size: 14px;"><strong>Name</strong></td><td style="padding: 8px 0; font-size: 14px;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #555; font-size: 14px;"><strong>Company</strong></td><td style="padding: 8px 0; font-size: 14px;">${company}</td></tr>
            <tr><td style="padding: 8px 0; color: #555; font-size: 14px;"><strong>Email</strong></td><td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #7c3aed;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #555; font-size: 14px;"><strong>Website / App</strong></td><td style="padding: 8px 0; font-size: 14px;">${website || "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #555; font-size: 14px;"><strong>Use Case</strong></td><td style="padding: 8px 0; font-size: 14px;">${useCase}</td></tr>
            <tr><td style="padding: 8px 0; color: #555; font-size: 14px;"><strong>Est. Volume</strong></td><td style="padding: 8px 0; font-size: 14px;">${volume || "—"}</td></tr>
          </table>
          ${message ? `
          <div style="margin-top: 16px; padding: 16px; background: #f9f9f9; border-radius: 8px;">
            <p style="margin: 0 0 8px; font-size: 13px; color: #555;"><strong>Additional notes</strong></p>
            <p style="margin: 0; font-size: 14px; color: #333; white-space: pre-wrap;">${message}</p>
          </div>` : ""}
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #aaa;">SKINIC Enterprise Inquiry System · skinic.app</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Enterprise inquiry error:", err);
    return NextResponse.json({ error: "Failed to send inquiry. Please email hello@skinic.app directly." }, { status: 500 });
  }
}
