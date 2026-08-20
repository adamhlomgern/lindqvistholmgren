export const mumsaConfig = {
  name: "Mumsa",
  logo: "/images/demos/mumsa-logo.svg",
  demoMode: true,
};

export const mumsaRoutes = {
  marketing: () => "/demos/mumsa",
  storefront: () => "/demo/mumsa",
  order: (id: string) => `/demo/mumsa/order/${id}`,
  restaurant: () => "/demo/mumsa/restaurang",
  owner: () => "/demo/mumsa/agare",
  onboarding: () => "/demo/mumsa/onboarding",
  contactCta: () => "/kontakt?interest=mumsa",
};
