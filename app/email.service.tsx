import { ServerClient } from "postmark";

const client = new ServerClient(process.env.POSTMARK_API_KEY as string);

/**
 * Sends a verification code email via Postmark
 * @param email - Recipient email address
 * @param code - The verification code to be sent
 */
export async function sendVerificationCode(email: string, code: string) {
    try {
        const response = await client.sendEmail({
            From: "mazen@savvy.codes", // Replace with your verified Postmark sender
            To: email,
            Subject: "Your Verification Code",
            TextBody: `Your verification code is: ${code}\nThis code expires in 10 minutes.`,
        });

        console.log("Email sent successfully:", response);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send verification code.");
    }
}
