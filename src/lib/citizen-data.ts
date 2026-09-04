export type ReportStatus = "Pending" | "Verified" | "Rejected";

export const citizenProfile = {
  name: "Ahmed Khan",
  firstName: "Ahmed",
  points: 2450,
  city: "Karachi",
  impactScore: 742,
};

export const impactSummary = {
  wasteKg: 12.4,
  actions: 38,
  hours: 18,
  trees: 24,
};

export const quickActions = [
  { key: "scan", label: "Scan Waste", to: "/citizen/scanner", tone: "primary" as const },
  { key: "report", label: "Report Issue", to: "/citizen/report", tone: "destructive" as const },
  { key: "cleanup", label: "Join Cleanup", to: "/citizen/campaigns", tone: "info" as const },
  { key: "trees", label: "Track Trees", to: "/citizen/impact", tone: "deep" as const },
];

export const nearbyActivity = [
  {
    id: "a1",
    title: "Illegal dumping cleared",
    area: "Clifton Block 5",
    distance: "400 m",
    time: "12 min ago",
    emoji: "🗑️",
  },
  {
    id: "a2",
    title: "Plastic haul verified",
    area: "Sea View",
    distance: "1.2 km",
    time: "48 min ago",
    emoji: "♻️",
  },
  {
    id: "a3",
    title: "Drain unblocked",
    area: "Korangi No. 4",
    distance: "3.1 km",
    time: "2 hrs ago",
    emoji: "🚰",
  },
  {
    id: "a4",
    title: "Community cleanup",
    area: "Gulshan-e-Iqbal",
    distance: "5.6 km",
    time: "5 hrs ago",
    emoji: "🧹",
  },
];

export const reportTypes = [
  { key: "dumping", label: "Illegal Dumping", emoji: "🚛", tone: "destructive" as const },
  { key: "litter", label: "Public Litter", emoji: "🗑️", tone: "amber" as const },
  { key: "burning", label: "Open Burning", emoji: "🔥", tone: "destructive" as const },
  { key: "drain", label: "Blocked Drain", emoji: "🚰", tone: "info" as const },
  { key: "mismanagement", label: "Waste Mismanagement", emoji: "♻️", tone: "primary" as const },
];

export const myReports: {
  id: string;
  type: string;
  area: string;
  date: string;
  status: ReportStatus;
}[] = [
  {
    id: "GP-2291",
    type: "Illegal Dumping",
    area: "Clifton Block 2",
    date: "28 Aug 2026",
    status: "Verified",
  },
  {
    id: "GP-2274",
    type: "Blocked Drain",
    area: "Korangi No. 4",
    date: "24 Aug 2026",
    status: "Pending",
  },
  {
    id: "GP-2251",
    type: "Open Burning",
    area: "Landhi Sector 36",
    date: "19 Aug 2026",
    status: "Verified",
  },
  { id: "GP-2210", type: "Public Litter", area: "Saddar", date: "11 Aug 2026", status: "Rejected" },
];

export const impactTimeline = [
  {
    id: "t1",
    date: "01 Sep 2026",
    action: "Recovered 2.1 kg PET bottles",
    emoji: "♻️",
    verified: true,
    points: 120,
  },
  {
    id: "t2",
    date: "29 Aug 2026",
    action: "Joined Clean Karachi beach drive",
    emoji: "🧹",
    verified: true,
    points: 200,
  },
  {
    id: "t3",
    date: "28 Aug 2026",
    action: "Reported illegal dumping (GP-2291)",
    emoji: "🚛",
    verified: true,
    points: 80,
  },
  {
    id: "t4",
    date: "24 Aug 2026",
    action: "Reported blocked drain (GP-2274)",
    emoji: "🚰",
    verified: false,
    points: 0,
  },
  {
    id: "t5",
    date: "18 Aug 2026",
    action: "Planted 3 neem saplings",
    emoji: "🌳",
    verified: true,
    points: 150,
  },
];

export const nearbyBins = [
  { id: "042", distance: "200 m", type: "Blue · Recyclables" },
  { id: "117", distance: "540 m", type: "Blue · Recyclables" },
  { id: "203", distance: "1.1 km", type: "Green · Organic" },
];

export const scanResult = {
  item: "Plastic Bottle",
  emoji: "🍶",
  category: "Recyclable",
  confidence: 94,
  advice: "Place in BLUE bin. Rinse before disposing.",
  tips: [
    "Crush to save space",
    "Remove the cap and label",
    "Keep it dry to protect other recyclables",
  ],
};

export const campaignFilters = [
  "All",
  "Nearby",
  "Cleanup",
  "Recycling",
  "Trees",
  "Plastic",
  "Community",
  "Corporate Sponsored",
];

export type Campaign = {
  id: string;
  title: string;
  sponsor: string;
  location: string;
  progress: number;
  currentKg: number;
  targetKg: number;
  participants: number;
  reward: string;
  tags: string[];
  emoji: string;
  about: string;
};

export const campaigns: Campaign[] = [
  {
    id: "clean-karachi",
    title: "Clean Karachi",
    sponsor: "Acme Consumer Group",
    location: "Clifton & Sea View, Karachi",
    progress: 76,
    currentKg: 3820,
    targetKg: 5000,
    participants: 2340,
    reward: "500 GP + eco-kit",
    tags: ["Nearby", "Cleanup", "Plastic", "Corporate Sponsored"],
    emoji: "🌊",
    about:
      "A city-wide plastic recovery drive across Karachi's coastal belt. Every kilogram is AI-classified, human-verified by Green Earth Foundation, and audited before it counts toward the sponsor's ESG ledger.",
  },
  {
    id: "korangi-recycles",
    title: "Korangi Recycles",
    sponsor: "Indus Packaging Ltd.",
    location: "Korangi Industrial Area",
    progress: 54,
    currentKg: 1620,
    targetKg: 3000,
    participants: 890,
    reward: "300 GP",
    tags: ["Recycling", "Community", "Corporate Sponsored"],
    emoji: "♻️",
    about:
      "Household recycling collection points across Korangi, with weekly pickup and verified weigh-ins at three municipal depots.",
  },
  {
    id: "green-belt-revival",
    title: "Green Belt Revival",
    sponsor: "Karachi Municipal Operations",
    location: "University Road Corridor",
    progress: 41,
    currentKg: 0,
    targetKg: 1200,
    participants: 610,
    reward: "Tree certificate + 250 GP",
    tags: ["Trees", "Community", "Nearby"],
    emoji: "🌳",
    about:
      "Planting and geo-tagging 1,200 native saplings along the University Road green belt, with survival checks every 90 days.",
  },
  {
    id: "sea-view-sweep",
    title: "Sea View Weekend Sweep",
    sponsor: "Green Earth Foundation",
    location: "Sea View Beach",
    progress: 88,
    currentKg: 2640,
    targetKg: 3000,
    participants: 1470,
    reward: "400 GP",
    tags: ["Nearby", "Cleanup", "Plastic"],
    emoji: "🏖️",
    about:
      "Saturday morning beach sweeps with on-site sorting stations and instant AI verification of every collected bag.",
  },
];
