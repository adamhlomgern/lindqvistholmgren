export const servicePlatformConfig = {
  name: "Servicekoll",
  logo: "/images/demos/servicekoll-logo.svg",
  demoMode: true,
};

export const serviceRoutes = {
  marketing: () => "/demos/servicekoll",
  dashboard: () => "/demo/servicekoll",
  customers: () => "/demo/servicekoll/customers",
  assets: (params?: { customerId?: string }) =>
    params?.customerId
      ? `/demo/servicekoll/assets?customer=${params.customerId}`
      : "/demo/servicekoll/assets",
  asset: (id: string) => `/demo/servicekoll/assets/${id}`,
  contactCta: () => "/kontakt?interest=servicekoll",
};
