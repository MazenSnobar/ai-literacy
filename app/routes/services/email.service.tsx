import "dotenv/config"; 
import nodemailer from "nodemailer";

let transport = nodemailer.createTransport(
  process.env.SMTP_URL,
  {
    from: process.env.SMTP_FROM,
  }
);


/**
 * Sends a verification code email via Postmark
 * @param email - Recipient email address
 * @param code - The verification code to be sent
 */
export async function sendVerificationCode(email: string, code: string) {
    try {
      const message = await transport.sendMail({
        to: email,
        subject: "Your Verification Code",
        text: `Your verification code is: ${code}\nThis code expires in 10 minutes.`,
      })

      console.log("Email sent successfully:", message.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send verification code.");
    }
}




