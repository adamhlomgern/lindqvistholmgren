import { getSmtpTransport } from "@/lib/email/client";
import { renderBrandedEmailHtml } from "@/lib/email/template";

type SendBrandedEmailOptions = {
  to: string;
  subject: string;
  heading: string;
  bodyHtml: string;
  ctaLabel: string;
  ctaUrl: string;
  footerHtml?: string;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer; contentType: string }[];
};

export async function sendBrandedEmail({
  to,
  subject,
  heading,
  bodyHtml,
  ctaLabel,
  ctaUrl,
  footerHtml,
  replyTo,
  attachments,
}: SendBrandedEmailOptions) {
  const transport = getSmtpTransport();
  await transport.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    replyTo,
    html: renderBrandedEmailHtml({ heading, bodyHtml, ctaLabel, ctaUrl, footerHtml }),
    attachments,
  });
}
