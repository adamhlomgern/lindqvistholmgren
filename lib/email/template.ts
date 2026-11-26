// Delad mall för mejl som skickas från vår egen kod (SMTP via lib/email/client.ts) —
// t.ex. framtida notiser om godkännanden och meddelanden i kundportalen.
// Supabase Auth-mejl (inbjudan, återställ lösenord) styrs separat i Supabase
// Dashboard → Authentication → Emails och rör inte den här mallen.
//
// Textbaserad logotyp istället för en bild: SVG:er renderas opålitligt i
// Gmail/Outlook, och en extern bild kräver en hostad URL plus riskerar att
// blockeras som standard i många mejlklienter.

type BrandedEmailOptions = {
  heading: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerHtml?: string;
};

export function renderBrandedEmailHtml({ heading, bodyHtml, ctaLabel, ctaUrl, footerHtml }: BrandedEmailOptions) {
  return `<div style="background-color:#f3f5f2;padding:40px 16px;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background-color:#ffffff;border-radius:16px;border:1px solid #e4e7e4;overflow:hidden;">
    <tr>
      <td style="padding:28px 32px 20px;">
        <span style="font-size:16px;font-weight:700;color:#151a17;letter-spacing:0.01em;">Lindqvist <span style="color:#7c5aa6;">/</span> Holmgren</span>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 8px;">
        <h1 style="margin:0;font-size:22px;line-height:1.25;font-weight:700;color:#151a17;">${heading}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 32px 28px;font-size:15px;line-height:1.6;color:#4b524e;">
        ${bodyHtml}
      </td>
    </tr>
    ${
      ctaLabel && ctaUrl
        ? `<tr>
      <td style="padding:0 32px 32px;">
        <a href="${ctaUrl}" style="display:inline-block;background-color:#026a49;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;padding:13px 26px;border-radius:9999px;">
          ${ctaLabel}
        </a>
      </td>
    </tr>`
        : ""
    }
    <tr>
      <td style="padding:20px 32px 28px;border-top:1px solid #e4e7e4;background-color:#f8f9f7;font-size:12px;line-height:1.6;color:#6b736f;">
        ${footerHtml ?? "Det här mejlet skickades från Lindqvist / Holmgrens kundportal."}
      </td>
    </tr>
  </table>
</div>`;
}
