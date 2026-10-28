import { Resend } from "resend";

const DEFAULT_TO = "ryanoforikoree@gmail.com";

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isContactEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export async function sendContactEmail(payload: ContactPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(apiKey);
  const to = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_TO;
  const from =
    process.env.RESEND_FROM?.trim() || "Ryan Portfolio <onboarding@resend.dev>";

  const { name, email, message } = payload;
  const subject = `Portfolio message from ${name}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    message,
  ].join("\n");

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
    <hr />
    <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
  `.trim();

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject,
    text,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}
