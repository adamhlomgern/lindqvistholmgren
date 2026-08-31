export const socialLinks = {
  facebook: "https://www.facebook.com/lindqvistholmgren/",
  instagram: "https://www.instagram.com/lindqvistholmgren/",
} as const;

export const contactInfo = {
  email: "info@lindqvistholmgren.se",
  whatsapp: "0703394053",
  whatsappHref: "https://wa.me/46703394053",
  address: "Frödingshöjd 36",
} as const;

// Ada och Malin driver varsin enskild firma under det gemensamma
// varumärket Lindqvist / Holmgren — inget delat bolag, så org.nr anges
// per person snarare än som ett gemensamt fält.
export const businessInfo = {
  ada: { name: "Ada", orgNumber: "951009-8537", vatNumber: "SE951009853701" },
  malin: { name: "Malin", orgNumber: "960223-9387" },
} as const;
