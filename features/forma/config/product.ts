export const formaConfig = {
  name: "Forma",
  demoMode: true,
};

export const formaRoutes = {
  marketing: () => "/demos/forma",
  home: () => "/demo/forma",
  configure: (params?: { resume?: string }) =>
    params?.resume ? `/demo/forma/konfigurera?resume=${params.resume}` : "/demo/forma/konfigurera",
  configuration: (id: string) => `/demo/forma/konfiguration/${id}`,
  success: (id: string) => `/demo/forma/tack/${id}`,
  leads: () => "/demo/forma/forfragningar",
  lead: (id: string) => `/demo/forma/forfragningar/${id}`,
  contactCta: () => "/kontakt?interest=forma",
};
