export type Role = "citizen" | "ngo" | "corporate" | "municipal";

export const roleHome: Record<Role, string> = {
  citizen: "/citizen/home",
  ngo: "/ngo/dashboard",
  corporate: "/corporate/dashboard",
  municipal: "/municipal/dashboard",
};

export const globalImpact = {
  actions: 31820,
  tonnes: 82.4,
  participants: 12480,
  countries: 8,
};

export const heroStats = [
  { label: "Verified Actions", value: "12,840" },
  { label: "Tonnes Recovered", value: "82.4" },
];

export const flagshipCampaign = {
  id: "karachi-plastic-recovery",
  name: "Karachi Plastic Recovery",
  sponsor: "Acme Consumer Group",
  ngo: "Green Earth Foundation",
  targetKg: 5000,
  currentKg: 3820,
  progress: 76,
  participants: 2340,
  city: "Karachi",
  invested: "₨8.4M",
};

export const demoProfiles = {
  citizen: {
    role: "citizen" as Role,
    name: "Ahmed Khan",
    org: "Citizen · Karachi",
    points: 2450,
    level: 7,
    city: "Karachi",
    email: "ahmed.khan@ecosphere.io",
  },
  ngo: {
    role: "ngo" as Role,
    name: "Green Earth Foundation",
    org: "Verification Partner",
    pendingVerifications: 28,
    city: "Karachi",
    email: "ops@greenearth.org",
  },
  corporate: {
    role: "corporate" as Role,
    name: "Acme Consumer Group",
    org: "Sustainability Office",
    invested: "₨8.4M",
    city: "Karachi",
    email: "esg@acmegroup.com",
  },
  municipal: {
    role: "municipal" as Role,
    name: "Karachi Municipal Operations",
    org: "City Waste Authority",
    city: "Karachi",
    email: "ops@kmc.gov.pk",
  },
};
