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
  return `<div style="background-color:#08100c;padding:40px 16px;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;background-color:#050806;border-radius:16px;border:1px solid rgba(231,244,238,0.1);overflow:hidden;">
    <tr>
      <td style="padding:32px 32px 24px;text-align:center;">
        <span style="font-size:18px;font-weight:700;color:#e7f4ee;letter-spacing:0.02em;">Lindqvist <span style="color:#34d399;">/</span> Holmgren</span>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 8px;">
        <h1 style="margin:0;font-size:20px;font-weight:700;color:#e7f4ee;">${heading}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 32px 28px;font-size:14px;line-height:1.6;color:#8fab9c;">
        ${bodyHtml}
      </td>
    </tr>
    ${
      ctaLabel && ctaUrl
        ? `<tr>
      <td style="padding:0 32px 32px;">
        <a href="${ctaUrl}" style="display:inline-block;background-color:#34d399;color:#050806;font-weight:700;font-size:14px;text-decoration:none;padding:12px 24px;border-radius:9999px;">
          ${ctaLabel}
        </a>
      </td>
    </tr>`
        : ""
    }
    <tr>
      <td style="padding:20px 32px 32px;border-top:1px solid rgba(231,244,238,0.08);font-size:12px;line-height:1.6;color:#8fab9c;">
        ${footerHtml ?? "Det här mejlet skickades från Lindqvist / Holmgrens kundportal."}
      </td>
    </tr>
  </table>
</div>`;
}
