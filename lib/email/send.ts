import { getSmtpTransport } from "@/lib/email/client";
import { renderBrandedEmailHtml } from "@/lib/email/template";

type SendBrandedEmailOptions = {
  to: string;
  subject: string;
  heading: string;
  bodyHtml: string;
  ctaLabel: string;
  ctaUrl: string;
};

export async function sendBrandedEmail({ to, subject, heading, bodyHtml, ctaLabel, ctaUrl }: SendBrandedEmailOptions) {
  const transport = getSmtpTransport();
  await transport.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    html: renderBrandedEmailHtml({ heading, bodyHtml, ctaLabel, ctaUrl }),
  });
}
