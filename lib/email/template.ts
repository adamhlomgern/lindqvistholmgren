// Delad mall för mejl som skickas från vår egen kod (SMTP via lib/email/client.ts):
// Hemsidekollens rapport, notiser från kundportalen m.m. Supabase Auth-mejl
// (inbjudan, återställ lösenord) styrs separat i Supabase Dashboard.
//
// Formspråket följer sajten: mörkgrönt sidhuvud med logga, Poppins i rubriker
// (där mejlprogrammet stöder webbtypsnitt, annars Helvetica/Arial), grön
// knapp och lila detaljer. Allt med tabeller och inline-stilar, eftersom
// Outlook och Gmail ignorerar det mesta annat. Bilderna ligger publikt under
// /images/email.

const SITE = "https://lindqvistholmgren.se";

type BrandedEmailOptions = {
  heading: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerHtml?: string;
  // Kort text som visas efter ämnesraden i inkorgen.
  preheader?: string;
  // Visa Ada och Malin som avsändare längst ner (standard: ja).
  signature?: boolean;
};

const font = "'Poppins','Helvetica Neue',Helvetica,Arial,sans-serif";
const text = "'Helvetica Neue',Helvetica,Arial,sans-serif";

export function renderBrandedEmailHtml({ heading, bodyHtml, ctaLabel, ctaUrl, footerHtml, preheader, signature = true }: BrandedEmailOptions) {
  return `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${heading}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&display=swap');
  @media (max-width: 600px) { .px { padding-left: 24px !important; padding-right: 24px !important; } .h1 { font-size: 24px !important; } }
  a { color: #0b5b41; }
</style>
</head>
<body style="margin:0;padding:0;background-color:#eef1ed;">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef1ed;">
  <tr>
    <td align="center" style="padding:32px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr>
          <td style="background-color:#06301f;border-radius:20px 20px 0 0;padding:26px 36px;" class="px">
            <a href="${SITE}" style="text-decoration:none;"><img src="${SITE}/images/email/logo-on-dark.png" width="137" height="48" alt="Lindqvist / Holmgren" style="display:block;border:0;height:40px;width:auto;"></a>
          </td>
        </tr>
        <tr>
          <td style="background-color:#ffffff;padding:36px 36px 8px;" class="px">
            <h1 class="h1" style="margin:0;font-family:${font};font-size:27px;line-height:1.2;font-weight:600;letter-spacing:-0.5px;color:#121614;">${heading}</h1>
          </td>
        </tr>
        <tr>
          <td style="background-color:#ffffff;padding:16px 36px 8px;font-family:${text};font-size:15px;line-height:1.65;color:#3f4642;" class="px">
            ${bodyHtml}
          </td>
        </tr>
        ${
          ctaLabel && ctaUrl
            ? `<tr>
          <td style="background-color:#ffffff;padding:20px 36px 8px;" class="px">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background-color:#0b5b41;">
              <a href="${ctaUrl}" style="display:inline-block;padding:14px 28px;font-family:${font};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;">${ctaLabel} &rarr;</a>
            </td></tr></table>
          </td>
        </tr>`
            : ""
        }
        ${
          signature
            ? `<tr>
          <td style="background-color:#ffffff;padding:28px 36px 32px;" class="px">
            <table role="presentation" cellpadding="0" cellspacing="0" style="border-top:1px solid #e3e7e3;padding-top:22px;width:100%;"><tr>
              <td width="96" style="padding-top:22px;vertical-align:middle;white-space:nowrap;">
                <img src="${SITE}/images/email/ada.png" width="40" height="40" alt="Ada" style="display:inline-block;border-radius:999px;border:2px solid #ffffff;vertical-align:middle;">
                <img src="${SITE}/images/email/malin.png" width="40" height="40" alt="Malin" style="display:inline-block;border-radius:999px;border:2px solid #ffffff;margin-left:-12px;vertical-align:middle;">
              </td>
              <td style="padding-top:22px;vertical-align:middle;font-family:${text};font-size:14px;line-height:1.45;color:#3f4642;">
                <strong style="font-family:${font};font-weight:600;color:#121614;">Ada &amp; Malin</strong><br>
                Lindqvist / Holmgren &middot; <a href="${SITE}" style="color:#5b3a83;text-decoration:none;">lindqvistholmgren.se</a>
              </td>
            </tr></table>
          </td>
        </tr>`
            : `<tr><td style="background-color:#ffffff;padding:16px 36px 16px;" class="px"></td></tr>`
        }
        <tr>
          <td style="background-color:#f6f0fc;border-radius:0 0 20px 20px;padding:20px 36px 24px;font-family:${text};font-size:12px;line-height:1.6;color:#6b5a80;" class="px">
            ${footerHtml ?? "Det här mejlet skickades från Lindqvist / Holmgrens kundportal."}
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:18px 12px 0;font-family:${text};font-size:11px;color:#8a918d;">
            Lindqvist / Holmgren &middot; Webb, design och system &middot; Karlstad
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

// Färdig "betygskort"-ruta för mejl (används av Hemsidekollen).
export function emailScoreCard({ score, label, host, rows }: { score: number; label: string; host: string; rows: string[] }) {
  const color = score >= 80 ? "#0b5b41" : score >= 55 ? "#8a5200" : "#a3171b";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;background-color:#f4f6f3;border-radius:16px;">
  <tr>
    <td width="92" align="center" style="padding:20px 0 20px 20px;vertical-align:middle;">
      <div style="width:76px;height:76px;border-radius:999px;background-color:#ffffff;border:6px solid ${color};text-align:center;">
        <div style="font-family:${font};font-size:28px;font-weight:700;line-height:76px;color:${color};">${score}</div>
      </div>
    </td>
    <td style="padding:20px;vertical-align:middle;font-family:${text};font-size:14px;line-height:1.5;color:#3f4642;">
      <div style="font-family:${font};font-size:17px;font-weight:600;color:#121614;">${host}</div>
      <div style="font-weight:600;color:${color};margin-top:2px;">${label}</div>
      ${rows.length ? `<div style="margin-top:8px;">${rows.map((r) => `<div style="margin-top:3px;">&#10148;&nbsp; ${r}</div>`).join("")}</div>` : ""}
    </td>
  </tr>
</table>`;
}
