import "dotenv/config"; 
import nodemailer from "nodemailer";

let transport = nodemailer.createTransport(
  process.env.SMTP_URL,
  {
    from: process.env.SMTP_FROM,
  }
);

export async function sendMagicLinkEmail(email: string, code: string, magicLink: string) {
  const html = `
    <h1>Sign in to Your Account</h1>
    <p>Use the following code to sign in: <strong>${code}</strong></p>
    <p>Or click this magic link for one‑click login:</p>
    <p><a href="${magicLink}">Log in Now</a></p>
    <p>This link expires in 5 minutes.</p>
  `;
  try {
    const message = await transport.sendMail({
      to: email,
      subject: "Your Magic Login Link",
      html,
    });

    console.log("Magic login email sent:", message.messageId);
  } catch (error) {
    console.error("Error sending magic link email:", error);
    throw new Error("Failed to send magic link email.");
  }
}





