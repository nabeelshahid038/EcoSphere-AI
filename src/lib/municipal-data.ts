export type MunicipalLayer =
  "Dumping" | "Litter" | "Burning" | "Blocked Drain" | "Cleanup" | "Resolved";

export type MunicipalSeverity = "Low" | "Medium" | "High" | "Critical";
export type MunicipalStatus =
  "Reported" | "AI Verified" | "Reviewed" | "Assigned" | "In Progress" | "Resolved";

export type MunicipalIncident = {
  id: string;
  layer: MunicipalLayer;
  title: string;
  location: string;
  district: string;
  lat: number;
  lng: number;
  severity: MunicipalSeverity;
  status: MunicipalStatus;
  reporter: string;
  reportedAt: string;
  hoursAgo: number;
  aiConfidence: number;
  assignedTeam: string;
  responseDue: string;
  repeatFrequency: string;
  description: string;
  photoTheme: string;
};

export const municipalIncidents: MunicipalIncident[] = [
  {
    id: "KMC-24091",
    layer: "Dumping",
    title: "Construction debris at Lyari Riverbank",
    location: "Mai Kolachi Road, Lyari Riverbank",
    district: "Karachi South",
    lat: 24.854,
    lng: 66.982,
    severity: "Critical",
    status: "AI Verified",
    reporter: "Hira Sheikh",
    reportedAt: "03 Sep, 08:12 PKT",
    hoursAgo: 3,
    aiConfidence: 96,
    assignedTeam: "Unassigned",
    responseDue: "Today, 14:00",
    repeatFrequency: "5 reports in 14 days",
    description:
      "Mixed rubble and household waste are blocking the riverbank service lane after overnight dumping.",
    photoTheme: "from-rose-950 via-rose-700 to-amber-500",
  },
  {
    id: "KMC-24090",
    layer: "Blocked Drain",
    title: "Overflowing storm drain",
    location: "Sector 33-A, Korangi Industrial Area",
    district: "Korangi",
    lat: 24.831,
    lng: 67.137,
    severity: "High",
    status: "Assigned",
    reporter: "Sana Iqbal",
    reportedAt: "03 Sep, 06:40 PKT",
    hoursAgo: 5,
    aiConfidence: 93,
    assignedTeam: "Drain Response Unit 4",
    responseDue: "Today, 12:30",
    repeatFrequency: "3 reports this week",
    description: "Plastic bags and silt have obstructed a roadside drain close to the bus stop.",
    photoTheme: "from-sky-950 via-sky-700 to-cyan-400",
  },
  {
    id: "KMC-24088",
    layer: "Litter",
    title: "Overflowing public bins",
    location: "Abdullah Shah Ghazi Road, Clifton Block 5",
    district: "Karachi South",
    lat: 24.816,
    lng: 67.031,
    severity: "Medium",
    status: "Reviewed",
    reporter: "Ahmed Khan",
    reportedAt: "03 Sep, 05:10 PKT",
    hoursAgo: 7,
    aiConfidence: 89,
    assignedTeam: "Unassigned",
    responseDue: "Today, 16:00",
    repeatFrequency: "Weekly recurring point",
    description: "Public bins have exceeded capacity following the weekend market rush.",
    photoTheme: "from-amber-950 via-amber-700 to-yellow-300",
  },
  {
    id: "KMC-24086",
    layer: "Burning",
    title: "Open waste burning near market",
    location: "M.A. Jinnah Road, Saddar",
    district: "Karachi South",
    lat: 24.86,
    lng: 67.021,
    severity: "Critical",
    status: "In Progress",
    reporter: "Bilal Raza",
    reportedAt: "02 Sep, 23:22 PKT",
    hoursAgo: 13,
    aiConfidence: 98,
    assignedTeam: "Rapid Response Unit 2",
    responseDue: "Crew on site",
    repeatFrequency: "2 reports in 30 days",
    description:
      "A burning pile of mixed waste is producing dense smoke beside late-night food stalls.",
    photoTheme: "from-orange-950 via-orange-600 to-amber-300",
  },
  {
    id: "KMC-24080",
    layer: "Cleanup",
    title: "Community cleanup ready for pickup",
    location: "Aisha Manzil Underpass, Gulshan-e-Iqbal",
    district: "Karachi East",
    lat: 24.921,
    lng: 67.088,
    severity: "Low",
    status: "Assigned",
    reporter: "Zara Ali",
    reportedAt: "02 Sep, 18:45 PKT",
    hoursAgo: 18,
    aiConfidence: 94,
    assignedTeam: "East Collection Crew 7",
    responseDue: "Today, 11:45",
    repeatFrequency: "One-off collection request",
    description: "Residents have bagged sorted recyclables after a verified community cleanup.",
    photoTheme: "from-emerald-950 via-emerald-600 to-lime-300",
  },
  {
    id: "KMC-24077",
    layer: "Dumping",
    title: "Illegal dumping beside railway wall",
    location: "Qasba Colony, Orangi Town",
    district: "Karachi West",
    lat: 24.946,
    lng: 66.998,
    severity: "High",
    status: "Reported",
    reporter: "Nida Kamal",
    reportedAt: "02 Sep, 15:20 PKT",
    hoursAgo: 22,
    aiConfidence: 84,
    assignedTeam: "Unassigned",
    responseDue: "Today, 18:00",
    repeatFrequency: "8 reports in 30 days",
    description: "A recurring roadside dumping point has expanded into the pedestrian access path.",
    photoTheme: "from-stone-950 via-stone-700 to-orange-400",
  },
  {
    id: "KMC-24062",
    layer: "Resolved",
    title: "Beach access litter cleared",
    location: "Sea View Service Road, Clifton",
    district: "Karachi South",
    lat: 24.8,
    lng: 67.046,
    severity: "Medium",
    status: "Resolved",
    reporter: "Usman Tariq",
    reportedAt: "01 Sep, 13:55 PKT",
    hoursAgo: 48,
    aiConfidence: 97,
    assignedTeam: "Coastal Cleanup Crew 1",
    responseDue: "Resolved in 9h",
    repeatFrequency: "Monitored weekly",
    description: "Waste around the beach access has been removed and bins were reset.",
    photoTheme: "from-slate-900 via-slate-600 to-slate-300",
  },
  {
    id: "KMC-24051",
    layer: "Blocked Drain",
    title: "Drain grate obstructed by packaging",
    location: "Nishtar Road, Malir City",
    district: "Malir",
    lat: 24.896,
    lng: 67.19,
    severity: "Medium",
    status: "AI Verified",
    reporter: "Farah Naeem",
    reportedAt: "31 Aug, 10:40 PKT",
    hoursAgo: 71,
    aiConfidence: 91,
    assignedTeam: "Unassigned",
    responseDue: "04 Sep, 10:00",
    repeatFrequency: "2 reports this month",
    description: "Light packaging waste is blocking the inlet before forecast rainfall.",
    photoTheme: "from-blue-950 via-blue-600 to-sky-300",
  },
  {
    id: "KMC-24047",
    layer: "Litter",
    title: "Market lane litter hotspot",
    location: "Empress Market Lane, Saddar",
    district: "Karachi South",
    lat: 24.858,
    lng: 67.027,
    severity: "High",
    status: "Resolved",
    reporter: "Taha Ahmed",
    reportedAt: "30 Aug, 17:05 PKT",
    hoursAgo: 112,
    aiConfidence: 95,
    assignedTeam: "South Collection Crew 3",
    responseDue: "Resolved in 15h",
    repeatFrequency: "Daily market monitoring",
    description: "Vendor-side waste accumulation has been collected and lane wash scheduled.",
    photoTheme: "from-neutral-900 via-neutral-600 to-neutral-300",
  },
  {
    id: "KMC-24041",
    layer: "Cleanup",
    title: "Park cleanup waste collection",
    location: "Aladin Park, Gulshan-e-Iqbal",
    district: "Karachi East",
    lat: 24.91,
    lng: 67.102,
    severity: "Low",
    status: "Resolved",
    reporter: "Maryam Aslam",
    reportedAt: "28 Aug, 12:15 PKT",
    hoursAgo: 165,
    aiConfidence: 99,
    assignedTeam: "East Collection Crew 5",
    responseDue: "Resolved in 7h",
    repeatFrequency: "Monthly drive",
    description: "A volunteer park cleanup has been collected, weighed, and closed out.",
    photoTheme: "from-green-950 via-green-600 to-emerald-300",
  },
];

export const municipalTeams = [
  "Rapid Response Unit 2",
  "Drain Response Unit 4",
  "South Collection Crew 3",
  "East Collection Crew 7",
  "Coastal Cleanup Crew 1",
  "West Sanitation Crew 6",
];

export const municipalHotspots = [
  {
    id: "HS-01",
    location: "Lyari Riverbank Service Lane",
    district: "Karachi South",
    reports: 42,
    severity: "Critical" as const,
    lastResponse: "28 min ago",
    repeatFrequency: "5 reports in 14 days",
    team: "Unassigned",
  },
  {
    id: "HS-02",
    location: "Korangi Sector 33-A Drain",
    district: "Korangi",
    reports: 27,
    severity: "High" as const,
    lastResponse: "1h 12m ago",
    repeatFrequency: "3 reports this week",
    team: "Drain Response Unit 4",
  },
  {
    id: "HS-03",
    location: "Qasba Colony Railway Wall",
    district: "Karachi West",
    reports: 19,
    severity: "High" as const,
    lastResponse: "2h 04m ago",
    repeatFrequency: "8 reports in 30 days",
    team: "Unassigned",
  },
  {
    id: "HS-04",
    location: "Empress Market Lane",
    district: "Karachi South",
    reports: 16,
    severity: "Medium" as const,
    lastResponse: "Yesterday",
    repeatFrequency: "Daily market monitoring",
    team: "South Collection Crew 3",
  },
  {
    id: "HS-05",
    location: "Abdullah Shah Ghazi Road",
    district: "Karachi South",
    reports: 11,
    severity: "Medium" as const,
    lastResponse: "3h 16m ago",
    repeatFrequency: "Weekly recurring point",
    team: "Unassigned",
  },
  {
    id: "HS-06",
    location: "Nishtar Road Inlet",
    district: "Malir",
    reports: 8,
    severity: "Medium" as const,
    lastResponse: "Yesterday",
    repeatFrequency: "2 reports this month",
    team: "West Sanitation Crew 6",
  },
];

export const districtReportData = [
  { district: "Korangi", reports: 84, resolved: 47 },
  { district: "South", reports: 76, resolved: 55 },
  { district: "West", reports: 61, resolved: 31 },
  { district: "East", reports: 48, resolved: 39 },
  { district: "Malir", reports: 35, resolved: 25 },
  { district: "Central", reports: 27, resolved: 21 },
];

export const resolutionRateData = [
  { month: "Apr", rate: 61 },
  { month: "May", rate: 66 },
  { month: "Jun", rate: 69 },
  { month: "Jul", rate: 71 },
  { month: "Aug", rate: 74 },
  { month: "Sep", rate: 78 },
];

export const responseTimeData = [
  { month: "Apr", hours: 46 },
  { month: "May", hours: 42 },
  { month: "Jun", hours: 38 },
  { month: "Jul", hours: 35 },
  { month: "Aug", hours: 32 },
  { month: "Sep", hours: 28 },
];

export const categoryData = [
  { name: "Dumping", value: 34, color: "var(--color-destructive)" },
  { name: "Litter", value: 24, color: "var(--color-amber)" },
  { name: "Blocked drain", value: 19, color: "var(--color-info)" },
  { name: "Burning", value: 13, color: "#f97316" },
  { name: "Cleanup", value: 10, color: "var(--color-primary)" },
];

export const weeklyTrendData = [
  { day: "Mon", reported: 42, resolved: 31 },
  { day: "Tue", reported: 49, resolved: 35 },
  { day: "Wed", reported: 57, resolved: 41 },
  { day: "Thu", reported: 51, resolved: 46 },
  { day: "Fri", reported: 66, resolved: 47 },
  { day: "Sat", reported: 38, resolved: 42 },
  { day: "Sun", reported: 29, resolved: 35 },
];

export const municipalNotifications = [
  {
    id: "n1",
    date: "Today",
    title: "Critical report needs assignment",
    detail: "Lyari Riverbank has crossed the high-severity threshold.",
    tone: "critical" as const,
  },
  {
    id: "n2",
    date: "Today",
    title: "Crew completed Sea View route",
    detail: "Coastal Cleanup Crew 1 verified 1.8 tonnes collected.",
    tone: "success" as const,
  },
  {
    id: "n3",
    date: "Yesterday",
    title: "Korangi drain response due",
    detail: "Drain Response Unit 4 is due on site by 12:30 PKT.",
    tone: "info" as const,
  },
  {
    id: "n4",
    date: "Earlier",
    title: "August report published",
    detail: "The redacted public disclosure is ready for council review.",
    tone: "success" as const,
  },
];

export const workflowSteps: MunicipalStatus[] = [
  "Reported",
  "AI Verified",
  "Reviewed",
  "Assigned",
  "In Progress",
  "Resolved",
];

export function formatPKR(amount: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}
