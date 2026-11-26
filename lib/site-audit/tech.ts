// Känner igen plattform, tillägg och tredjepartstjänster från startsidans
// HTML och svarshuvuden. Används både för att visa "byggd med" och för att
// anpassa "Så fixar ni det" efter plattformen.

export type TechKind = "Plattform" | "Tillägg" | "Analys" | "Marknadsföring" | "Samtycke" | "Chatt" | "Typsnitt" | "Drift" | "Bibliotek" | "Övrigt";

export type Tech = { name: string; kind: TechKind; version?: string };

type Rule = { name: string; kind: TechKind; test: RegExp; version?: RegExp; header?: string };

// Ordningen spelar roll inom en kind: första träff av en plattform vinner.
const rules: Rule[] = [
  { name: "WordPress", kind: "Plattform", test: /\/wp-content\/|\/wp-includes\/|<meta[^>]+generator[^>]+wordpress/i, version: /<meta[^>]+content=["']WordPress\s*([\d.]+)/i },
  { name: "Wix", kind: "Plattform", test: /static\.wixstatic\.com|wix-code|_wixCIDX|x-wix-request-id/i },
  { name: "Squarespace", kind: "Plattform", test: /static1\.squarespace\.com|squarespace-cdn|Static\.SQUARESPACE_CONTEXT/i },
  { name: "Shopify", kind: "Plattform", test: /cdn\.shopify\.com|Shopify\.theme|myshopify\.com/i },
  { name: "Webflow", kind: "Plattform", test: /data-wf-page|webflow\.js|assets\.website-files\.com|cdn\.prod\.website-files\.com/i },
  { name: "Joomla", kind: "Plattform", test: /<meta[^>]+generator[^>]+joomla|\/media\/jui\//i, version: /<meta[^>]+content=["']Joomla!?\s*([\d.]+)/i },
  { name: "Drupal", kind: "Plattform", test: /<meta[^>]+generator[^>]+drupal|\/sites\/default\/files\/|drupal-settings-json/i, version: /<meta[^>]+content=["']Drupal\s*([\d.]+)/i },
  { name: "Sitevision", kind: "Plattform", test: /sitevision|sv-portlet|\/sitevision\//i },
  { name: "Hemsida24", kind: "Plattform", test: /hemsida24/i },
  { name: "Weebly", kind: "Plattform", test: /weebly\.com|editmysite\.com/i },
  { name: "Strikingly", kind: "Plattform", test: /strikingly/i },
  { name: "Framer", kind: "Plattform", test: /framerusercontent\.com|framer\.com\/m\//i },
  { name: "HubSpot CMS", kind: "Plattform", test: /hs-sites\.com|hubspot\.net\/hub\/|<meta[^>]+generator[^>]+hubspot/i },
  { name: "Next.js", kind: "Plattform", test: /\/_next\/static\//i },
  { name: "Nuxt", kind: "Plattform", test: /\/_nuxt\//i },
  { name: "Gatsby", kind: "Plattform", test: /___gatsby/i },

  { name: "WooCommerce", kind: "Tillägg", test: /woocommerce/i },
  { name: "Elementor", kind: "Tillägg", test: /elementor/i },
  { name: "Divi", kind: "Tillägg", test: /et_pb_|\/themes\/Divi\//i },
  { name: "Yoast SEO", kind: "Tillägg", test: /yoast/i },
  { name: "Rank Math", kind: "Tillägg", test: /rank-math|rankmath/i },
  { name: "WPBakery", kind: "Tillägg", test: /js_composer|vc_row/i },
  { name: "Contact Form 7", kind: "Tillägg", test: /wpcf7/i },

  { name: "Google Analytics", kind: "Analys", test: /gtag\/js\?id=G-|google-analytics\.com\/(analytics|ga)\.js|['"]UA-\d+-\d+/i },
  { name: "Google Tag Manager", kind: "Analys", test: /googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]{4,}/ },
  { name: "Microsoft Clarity", kind: "Analys", test: /clarity\.ms\/tag/i },
  { name: "Hotjar", kind: "Analys", test: /static\.hotjar\.com|hotjar\.com\/c\/hotjar/i },
  { name: "Plausible", kind: "Analys", test: /plausible\.io\/js/i },
  { name: "Matomo", kind: "Analys", test: /matomo\.js|piwik\.js/i },
  { name: "Vercel Analytics", kind: "Analys", test: /_vercel\/insights|va\.vercel-scripts\.com/i },

  { name: "Meta-pixel", kind: "Marknadsföring", test: /connect\.facebook\.net\/[^"']*fbevents\.js|fbq\(['"]init/i },
  { name: "LinkedIn Insight", kind: "Marknadsföring", test: /snap\.licdn\.com/i },
  { name: "TikTok-pixel", kind: "Marknadsföring", test: /analytics\.tiktok\.com/i },
  { name: "Google Ads", kind: "Marknadsföring", test: /googleadservices\.com|gtag\/js\?id=AW-/i },
  { name: "Mailchimp", kind: "Marknadsföring", test: /chimpstatic\.com|list-manage\.com/i },

  { name: "Cookiebot", kind: "Samtycke", test: /consent\.cookiebot\.com|cookiebot/i },
  { name: "CookieYes", kind: "Samtycke", test: /cookieyes/i },
  { name: "OneTrust", kind: "Samtycke", test: /onetrust|cookielaw\.org/i },
  { name: "Complianz", kind: "Samtycke", test: /complianz|cmplz/i },
  { name: "Cookie Information", kind: "Samtycke", test: /cookieinformation\.com|coi-banner/i },
  { name: "Cookie-Script", kind: "Samtycke", test: /cookie-script\.com/i },
  { name: "Usercentrics", kind: "Samtycke", test: /usercentrics/i },
  { name: "iubenda", kind: "Samtycke", test: /iubenda/i },
  { name: "Borlabs Cookie", kind: "Samtycke", test: /borlabs/i },
  { name: "CookieHub", kind: "Samtycke", test: /cookiehub/i },
  { name: "Cookie-banner", kind: "Samtycke", test: /cookie-law-info|cookie-notice|cookieconsent|cookie-consent|klaro|termly/i },

  { name: "Intercom", kind: "Chatt", test: /widget\.intercom\.io|intercomSettings/i },
  { name: "Tidio", kind: "Chatt", test: /code\.tidio\.co/i },
  { name: "Crisp", kind: "Chatt", test: /client\.crisp\.chat/i },
  { name: "tawk.to", kind: "Chatt", test: /embed\.tawk\.to/i },
  { name: "HubSpot", kind: "Chatt", test: /js\.hs-scripts\.com|js\.hsforms\.net/i },
  { name: "Zendesk", kind: "Chatt", test: /static\.zdassets\.com/i },
  { name: "LiveChat", kind: "Chatt", test: /cdn\.livechatinc\.com/i },

  { name: "Google Fonts", kind: "Typsnitt", test: /fonts\.googleapis\.com|fonts\.gstatic\.com/i },
  { name: "Adobe Fonts", kind: "Typsnitt", test: /use\.typekit\.net/i },
  { name: "Font Awesome", kind: "Typsnitt", test: /font-?awesome/i },

  { name: "jQuery", kind: "Bibliotek", test: /jquery[\w.-]*\.js/i, version: /jquery[.-]?(\d+\.\d+(?:\.\d+)?)(?:\.min)?\.js|jquery(?:\.min)?\.js\?ver=(\d+\.\d+(?:\.\d+)?)/i },
  { name: "Bootstrap", kind: "Bibliotek", test: /bootstrap(\.min)?\.(css|js)/i },
  { name: "React", kind: "Bibliotek", test: /react-dom|data-reactroot|__NEXT_DATA__/i },

  { name: "Klarna", kind: "Övrigt", test: /klarna/i },
  { name: "Calendly", kind: "Övrigt", test: /calendly\.com/i },
  { name: "Bokadirekt", kind: "Övrigt", test: /bokadirekt/i },
  { name: "Trustpilot", kind: "Övrigt", test: /trustpilot/i },
  { name: "Reco", kind: "Övrigt", test: /reco\.se/i },
  { name: "reCAPTCHA", kind: "Övrigt", test: /recaptcha/i },
  { name: "Google Maps", kind: "Övrigt", test: /maps\.googleapis\.com|google\.com\/maps\/embed/i },
  { name: "YouTube", kind: "Övrigt", test: /youtube\.com\/embed|youtube-nocookie/i },
];

export function detectTech(html: string, headers: Record<string, string>): Tech[] {
  const found: Tech[] = [];
  const headerBlob = Object.entries(headers)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  const haystack = `${html}\n${headerBlob}`;
  let platform = false;
  for (const rule of rules) {
    if (!rule.test.test(haystack)) continue;
    if (rule.kind === "Plattform") {
      // Next.js/Nuxt/Gatsby är ramverk; visa dem bara om ingen CMS hittats.
      if (platform) continue;
      platform = true;
    }
    if (rule.kind === "Samtycke" && found.some((t) => t.kind === "Samtycke")) continue;
    const match = rule.version ? haystack.match(rule.version) : null;
    const version = match ? (match[1] ?? match[2]) : undefined;
    found.push({ name: rule.name, kind: rule.kind, ...(version ? { version } : {}) });
  }

  const server = headers["server"] ?? "";
  if (headers["x-vercel-id"]) found.push({ name: "Vercel", kind: "Drift" });
  else if (headers["x-nf-request-id"]) found.push({ name: "Netlify", kind: "Drift" });
  else if (/cloudflare/i.test(server) || headers["cf-ray"]) found.push({ name: "Cloudflare", kind: "Drift" });
  else if (/litespeed/i.test(server)) found.push({ name: "LiteSpeed", kind: "Drift" });
  else if (/nginx/i.test(server)) found.push({ name: "nginx", kind: "Drift" });
  else if (/apache/i.test(server)) found.push({ name: "Apache", kind: "Drift" });

  const php = (headers["x-powered-by"] ?? "").match(/PHP\/(\d+\.\d+(?:\.\d+)?)/i);
  if (php) found.push({ name: "PHP", kind: "Drift", version: php[1] });
  return found;
}

export const platformOf = (tech: Tech[]) => tech.find((t) => t.kind === "Plattform")?.name ?? null;

// Jämför versionssträngar som "3.4.1" < "3.5".
export function versionBelow(version: string, min: string) {
  const a = version.split(".").map(Number);
  const b = min.split(".").map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    if (x !== y) return x < y;
  }
  return false;
}
