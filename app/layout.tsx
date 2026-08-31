import type { Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { ProjectInquiryProvider } from "@/components/contact/ProjectInquiryContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lindqvistholmgren.se"),
  title: {
    default: "Lindqvist / Holmgren — Kreativ digital byrå i Karlstad",
    template: "%s — Lindqvist / Holmgren",
  },
  description:
    "Vi är två frilansare i Karlstad som hjälper småföretag i hela Sverige med webb, design och digital marknadsföring — personligt och utan mellanhänder.",
  keywords: [
    "webbyrå Karlstad",
    "webbdesign",
    "digital marknadsföring",
    "hemsida företag",
    "grafisk design",
    "Värmland",
  ],
  authors: [{ name: "Lindqvist / Holmgren" }],
  openGraph: {
    type: "website",
    locale: "sv_SE",
    siteName: "Lindqvist / Holmgren",
    title: "Lindqvist / Holmgren — Kreativ digital byrå i Karlstad",
    description:
      "Två frilansare, ett team. Er digitala partner i Karlstad — webb, design och digital marknadsföring.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Lindqvist / Holmgren",
  url: "https://lindqvistholmgren.se",
  logo: "https://lindqvistholmgren.se/images/lindqvist-holmgren/lindqvist-holmgren-full-logo.svg",
  image: "https://lindqvistholmgren.se/images/lindqvist-holmgren/lindqvist-holmgren-full-logo.svg",
  description:
    "Vi är två frilansare i Karlstad som hjälper småföretag i hela Sverige med webb, design och digital marknadsföring.",
  email: "info@lindqvistholmgren.se",
  areaServed: { "@type": "Country", name: "Sverige" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Karlstad",
    addressCountry: "SE",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sv"
      className={`${geistSans.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-forest text-bone">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ProjectInquiryProvider>
          <SiteChrome>{children}</SiteChrome>
        </ProjectInquiryProvider>
        <Analytics />
        {process.env.NODE_ENV === "production" && <GoogleAnalytics gaId="G-Z7KLXKREBF" />}
      </body>
    </html>
  );
}
