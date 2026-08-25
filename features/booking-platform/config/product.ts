export const bokadConfig = {
  name: "Bokad",
  logo: "/images/demos/bokad-logo.svg",
  demoMode: true,
};

export const bokadRoutes = {
  marketing: () => "/demos/bokad",
  directory: (params?: { business?: string }) =>
    params?.business ? `/demo/bokad?business=${params.business}` : "/demo/bokad",
  salon: (slug: string) => `/demo/bokad/salong/${slug}`,
  booking: (id: string) => `/demo/bokad/bokning/${id}`,
  calendar: (params?: { business?: string }) =>
    params?.business ? `/demo/bokad/kalender?business=${params.business}` : "/demo/bokad/kalender",
  owner: (params?: { business?: string }) =>
    params?.business ? `/demo/bokad/agare?business=${params.business}` : "/demo/bokad/agare",
  // Underton skiljer sig medvetet från Servicekoll/Mumsas kontakt-CTA: Bokad
  // är LH:s egen plattform, så frågan är "vill ni synas i den" eller "vill ni
  // bygga en egen", inte "vill ni ha en kopia byggd åt er".
  contactCta: () => "/kontakt?interest=bokad",
};
