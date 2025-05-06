import VerificationEmail from "../../emails/VarificitonEmail";
import { resend } from "@/lib/reSend";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  varifyCode: string
) => {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verify your email || Rbook",
      react: VerificationEmail({ username, otp: varifyCode }),
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};
