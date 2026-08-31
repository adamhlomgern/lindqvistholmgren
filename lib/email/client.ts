import nodemailer, { type Transporter } from "nodemailer";

let transport: Transporter | null = null;

export function getSmtpTransport(): Transporter {
  if (transport) return transport;

  transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return transport;
}
