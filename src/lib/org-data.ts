export type VerificationStatus = "Pending" | "Approved" | "Rejected" | "More info";

export type EvidenceItem = {
  id: string;
  user: string;
  action: string;
  category: "Plastic" | "Mixed" | "E-waste" | "Dumping" | "Trees";
  location: string;
  confidence: number;
  votes: number;
  status: VerificationStatus;
  submitted: string;
  campaign: string;
  emoji: string;
  weightKg: number;
  lat: number;
  lng: number;
};

export const verificationQueue: EvidenceItem[] = [
  {
    id: "EV-4821",
    user: "Ahmed Khan",
    action: "Plastic bottle haul",
    category: "Plastic",
    location: "Clifton Block 5",
    confidence: 97,
    votes: 14,
    status: "Pending",
    submitted: "12 min ago",
    campaign: "Karachi Plastic Recovery",
    emoji: "♻️",
    weightKg: 6.2,
    lat: 24.81,
    lng: 67.03,
  },
  {
    id: "EV-4822",
    user: "Sana Iqbal",
    action: "Mixed dry waste collection",
    category: "Mixed",
    location: "Korangi Sector 33",
    confidence: 91,
    votes: 9,
    status: "Pending",
    submitted: "38 min ago",
    campaign: "Korangi Cleanup Drive",
    emoji: "🗑️",
    weightKg: 12.8,
    lat: 24.83,
    lng: 67.13,
  },
  {
    id: "EV-4823",
    user: "Bilal Raza",
    action: "E-waste drop-off",
    category: "E-waste",
    location: "Saddar",
    confidence: 88,
    votes: 6,
    status: "Pending",
    submitted: "1 hr ago",
    campaign: "Karachi Plastic Recovery",
    emoji: "🔌",
    weightKg: 3.1,
    lat: 24.86,
    lng: 67.02,
  },
  {
    id: "EV-4824",
    user: "Hira Sheikh",
    action: "Illegal dumping report",
    category: "Dumping",
    location: "Lyari Riverbank",
    confidence: 82,
    votes: 21,
    status: "Pending",
    submitted: "2 hrs ago",
    campaign: "River Guardians",
    emoji: "🚛",
    weightKg: 0,
    lat: 24.89,
    lng: 66.99,
  },
  {
    id: "EV-4825",
    user: "Usman Tariq",
    action: "Mangrove sapling planted",
    category: "Trees",
    location: "Sandspit",
    confidence: 94,
    votes: 11,
    status: "Pending",
    submitted: "3 hrs ago",
    campaign: "Mangrove Restoration",
    emoji: "🌱",
    weightKg: 0,
    lat: 24.83,
    lng: 66.91,
  },
  {
    id: "EV-4818",
    user: "Zara Ali",
    action: "Beach plastic pickup",
    category: "Plastic",
    location: "Sea View",
    confidence: 96,
    votes: 32,
    status: "Approved",
    submitted: "Yesterday",
    campaign: "Karachi Plastic Recovery",
    emoji: "♻️",
    weightKg: 9.4,
    lat: 24.8,
    lng: 67.05,
  },
  {
    id: "EV-4816",
    user: "Faisal Butt",
    action: "Duplicate scan attempt",
    category: "Mixed",
    location: "Gulshan-e-Iqbal",
    confidence: 41,
    votes: 2,
    status: "Rejected",
    submitted: "Yesterday",
    campaign: "Korangi Cleanup Drive",
    emoji: "🗑️",
    weightKg: 0,
    lat: 24.92,
    lng: 67.09,
  },
  {
    id: "EV-4814",
    user: "Nida Kamal",
    action: "Drain clearing crew",
    category: "Dumping",
    location: "Orangi Town",
    confidence: 78,
    votes: 8,
    status: "More info",
    submitted: "2 days ago",
    campaign: "River Guardians",
    emoji: "🚰",
    weightKg: 0,
    lat: 24.95,
    lng: 66.99,
  },
];

export const ngoCampaignNames = [
  "All campaigns",
  "Karachi Plastic Recovery",
  "Korangi Cleanup Drive",
  "River Guardians",
  "Mangrove Restoration",
];

export const weeklyVerification = [
  { day: "Mon", verified: 182, rejected: 12 },
  { day: "Tue", verified: 214, rejected: 9 },
  { day: "Wed", verified: 268, rejected: 18 },
  { day: "Thu", verified: 241, rejected: 14 },
  { day: "Fri", verified: 312, rejected: 21 },
  { day: "Sat", verified: 388, rejected: 16 },
  { day: "Sun", verified: 237, rejected: 11 },
];

export const approvalSplit = [
  { name: "Approved", value: 1842, color: "var(--color-primary)" },
  { name: "Rejected", value: 101, color: "var(--color-destructive)" },
  { name: "More info", value: 64, color: "var(--color-amber)" },
];

export const monthlyActions = [
  { month: "Mar", actions: 3120 },
  { month: "Apr", actions: 3840 },
  { month: "May", actions: 4210 },
  { month: "Jun", actions: 5180 },
  { month: "Jul", actions: 6420 },
  { month: "Aug", actions: 8050 },
];

export const wasteBreakdown = [
  { name: "Plastic", value: 42.6, color: "var(--color-primary)" },
  { name: "Mixed dry", value: 21.8, color: "var(--color-info)" },
  { name: "Organic", value: 11.2, color: "var(--color-amber)" },
  { name: "E-waste", value: 6.8, color: "var(--color-primary-deep)" },
];

export type Campaign = {
  id: string;
  name: string;
  sponsor: string;
  city: string;
  status: "Active" | "Completed" | "Planning";
  investment: string;
  targetKg: number;
  verifiedKg: number;
  participants: number;
  verificationRate: number;
  cover: string;
  about: string;
};

export const corporateCampaigns: Campaign[] = [
  {
    id: "karachi-plastic-recovery",
    name: "Karachi Plastic Recovery",
    sponsor: "Acme Consumer Group",
    city: "Karachi",
    status: "Active",
    investment: "₨8.4M",
    targetKg: 5000,
    verifiedKg: 3820,
    participants: 2340,
    verificationRate: 96,
    cover: "from-primary-dark via-primary-deep to-primary",
    about:
      "Flagship plastic recovery programme across Karachi South and East, verified by Green Earth Foundation with AI-assisted evidence review.",
  },
  {
    id: "korangi-cleanup-drive",
    name: "Korangi Cleanup Drive",
    sponsor: "Acme Consumer Group",
    city: "Korangi",
    status: "Active",
    investment: "₨2.1M",
    targetKg: 2000,
    verifiedKg: 1180,
    participants: 860,
    verificationRate: 93,
    cover: "from-info via-primary-deep to-primary",
    about:
      "Neighbourhood cleanup sprints with local schools and waste worker cooperatives in Korangi industrial belt.",
  },
  {
    id: "mangrove-restoration",
    name: "Mangrove Restoration",
    sponsor: "Acme Consumer Group",
    city: "Sandspit",
    status: "Active",
    investment: "₨3.6M",
    targetKg: 1200,
    verifiedKg: 640,
    participants: 410,
    verificationRate: 98,
    cover: "from-primary-deep via-primary to-amber",
    about:
      "Coastal mangrove planting and monitoring with geo-tagged sapling survival checks every 90 days.",
  },
  {
    id: "river-guardians",
    name: "River Guardians",
    sponsor: "Acme Consumer Group",
    city: "Lyari",
    status: "Planning",
    investment: "₨1.2M",
    targetKg: 900,
    verifiedKg: 120,
    participants: 240,
    verificationRate: 88,
    cover: "from-primary-dark via-info to-primary",
    about:
      "Riverbank dumping surveillance and community reporting network along the Lyari corridor.",
  },
];

export const mapPins = [
  {
    id: "p1",
    type: "dumping" as const,
    label: "Illegal dumping cleared",
    area: "Lyari Riverbank",
    top: 22,
    left: 28,
  },
  {
    id: "p2",
    type: "scan" as const,
    label: "Plastic haul verified",
    area: "Clifton Block 5",
    top: 62,
    left: 44,
  },
  {
    id: "p3",
    type: "tree" as const,
    label: "Mangrove saplings",
    area: "Sandspit",
    top: 74,
    left: 18,
  },
  {
    id: "p4",
    type: "scan" as const,
    label: "Recycling drop-off",
    area: "Saddar",
    top: 38,
    left: 55,
  },
  {
    id: "p5",
    type: "dumping" as const,
    label: "Dump site reported",
    area: "Orangi Town",
    top: 14,
    left: 62,
  },
  {
    id: "p6",
    type: "scan" as const,
    label: "Beach cleanup batch",
    area: "Sea View",
    top: 80,
    left: 66,
  },
  {
    id: "p7",
    type: "tree" as const,
    label: "Urban tree plot",
    area: "Gulshan-e-Iqbal",
    top: 30,
    left: 78,
  },
  {
    id: "p8",
    type: "scan" as const,
    label: "School collection",
    area: "Korangi No. 4",
    top: 55,
    left: 84,
  },
];

export const topContributors = [
  { name: "Ahmed Khan", area: "Clifton", actions: 128, kg: 96.4, hours: 42 },
  { name: "Zara Ali", area: "Sea View", actions: 112, kg: 88.1, hours: 38 },
  { name: "Sana Iqbal", area: "Korangi", actions: 97, kg: 74.6, hours: 31 },
  { name: "Bilal Raza", area: "Saddar", actions: 84, kg: 61.2, hours: 27 },
  { name: "Hira Sheikh", area: "Lyari", actions: 71, kg: 52.8, hours: 24 },
];

export const campaignTimeline = [
  {
    date: "28 Aug 2026",
    title: "Monthly ESG evidence pack exported",
    status: "Completed" as const,
    detail: "1,842 verified actions bundled with GPS and AI metadata.",
  },
  {
    date: "19 Aug 2026",
    title: "3,500 kg milestone reached",
    status: "Completed" as const,
    detail: "70% of the FY26 pledge verified by Green Earth Foundation.",
  },
  {
    date: "07 Aug 2026",
    title: "Korangi field team onboarded",
    status: "Completed" as const,
    detail: "42 new volunteers trained on evidence capture.",
  },
  {
    date: "24 Jul 2026",
    title: "Duplicate-detection model upgraded",
    status: "Completed" as const,
    detail: "False positives down 34% across plastic categories.",
  },
  {
    date: "12 Sep 2026",
    title: "Q3 third-party audit scheduled",
    status: "Upcoming" as const,
    detail: "Independent auditor reviews sampled evidence trail.",
  },
];

export const evidenceGallery = [
  {
    id: "EV-4821",
    action: "Plastic bottle haul",
    date: "02 Sep 2026",
    location: "Karachi, PK",
    confidence: 97,
    level: "Fully verified",
    emoji: "♻️",
    cover: "from-primary to-primary-deep",
  },
  {
    id: "EV-4818",
    action: "Beach plastic pickup",
    date: "01 Sep 2026",
    location: "Karachi, PK",
    confidence: 96,
    level: "Fully verified",
    emoji: "🏖️",
    cover: "from-info to-primary",
  },
  {
    id: "EV-4812",
    action: "Mangrove sapling planted",
    date: "31 Aug 2026",
    location: "Karachi, PK",
    confidence: 94,
    level: "Fully verified",
    emoji: "🌱",
    cover: "from-primary-deep to-primary-dark",
  },
  {
    id: "EV-4807",
    action: "E-waste drop-off",
    date: "30 Aug 2026",
    location: "Karachi, PK",
    confidence: 88,
    level: "Community verified",
    emoji: "🔌",
    cover: "from-amber to-primary",
  },
  {
    id: "EV-4801",
    action: "Illegal dumping report",
    date: "29 Aug 2026",
    location: "Karachi, PK",
    confidence: 82,
    level: "Community verified",
    emoji: "🚛",
    cover: "from-destructive to-amber",
  },
  {
    id: "EV-4795",
    action: "Drain clearing crew",
    date: "28 Aug 2026",
    location: "Karachi, PK",
    confidence: 91,
    level: "Fully verified",
    emoji: "🚰",
    cover: "from-info to-primary-deep",
  },
  {
    id: "EV-4790",
    action: "School recycling batch",
    date: "27 Aug 2026",
    location: "Karachi, PK",
    confidence: 93,
    level: "Fully verified",
    emoji: "🏫",
    cover: "from-primary to-info",
  },
  {
    id: "EV-4783",
    action: "Mixed dry waste collection",
    date: "26 Aug 2026",
    location: "Karachi, PK",
    confidence: 90,
    level: "Fully verified",
    emoji: "🗑️",
    cover: "from-primary-dark to-primary",
  },
];

export const evidenceTypes = [
  { key: "photo", label: "Photos", detail: "Original capture, unedited" },
  { key: "gps", label: "GPS", detail: "Geo-fenced within 500 m" },
  { key: "time", label: "Timestamp", detail: "Device + server clock match" },
  { key: "ai", label: "AI", detail: "Classification + duplicate check" },
  { key: "community", label: "Community", detail: "Peer upvotes" },
  { key: "org", label: "Organization", detail: "NGO field sign-off" },
];

export const evidenceTimeline = [
  { label: "Captured by citizen", time: "08:12 PKT" },
  { label: "AI classification passed", time: "08:12 PKT" },
  { label: "Duplicate check passed", time: "08:13 PKT" },
  { label: "Community upvotes (14)", time: "09:40 PKT" },
  { label: "NGO field verification", time: "14:05 PKT" },
  { label: "Sealed into evidence trail", time: "14:06 PKT" },
];

export const rejectReasons = [
  "Duplicate submission",
  "Image quality too low",
  "Location outside campaign area",
  "Waste type mismatch",
  "Suspected staged evidence",
];

export type MunicipalIssueStatus = "Open" | "Scheduled" | "Resolved";
export type MunicipalSeverity = "Minor" | "Moderate" | "Major";

export type MunicipalIssue = {
  id: string;
  type: string;
  location: string;
  district: string;
  severity: MunicipalSeverity;
  status: MunicipalIssueStatus;
  reported: string;
  reportedBy: string;
  lat: number;
  lng: number;
};

export const municipalIssues: MunicipalIssue[] = [
  {
    id: "ISS-09203",
    type: "Illegal dumping",
    location: "Lyari Riverbank",
    district: "Lyari",
    severity: "Major",
    status: "Open",
    reported: "2 hrs ago",
    reportedBy: "Hira Sheikh",
    lat: 24.89,
    lng: 66.99,
  },
  {
    id: "ISS-09202",
    type: "Blocked drain",
    location: "Korangi Sector 33",
    district: "Korangi",
    severity: "Moderate",
    status: "Scheduled",
    reported: "4 hrs ago",
    reportedBy: "Sana Iqbal",
    lat: 24.83,
    lng: 67.13,
  },
  {
    id: "ISS-09201",
    type: "Public litter",
    location: "Clifton Block 5",
    district: "Clifton",
    severity: "Minor",
    status: "Open",
    reported: "5 hrs ago",
    reportedBy: "Ahmed Khan",
    lat: 24.81,
    lng: 67.03,
  },
  {
    id: "ISS-09200",
    type: "Open burning",
    location: "Saddar market",
    district: "Saddar",
    severity: "Major",
    status: "Scheduled",
    reported: "7 hrs ago",
    reportedBy: "Bilal Raza",
    lat: 24.86,
    lng: 67.02,
  },
  {
    id: "ISS-09198",
    type: "Waste mismanagement",
    location: "Gulshan-e-Iqbal",
    district: "Gulshan",
    severity: "Minor",
    status: "Resolved",
    reported: "Yesterday",
    reportedBy: "Zara Ali",
    lat: 24.92,
    lng: 67.09,
  },
  {
    id: "ISS-09195",
    type: "Illegal dumping",
    location: "Orangi Town",
    district: "Orangi",
    severity: "Moderate",
    status: "Open",
    reported: "Yesterday",
    reportedBy: "Nida Kamal",
    lat: 24.95,
    lng: 66.99,
  },
  {
    id: "ISS-09192",
    type: "Blocked drain",
    location: "Sea View road",
    district: "Clifton",
    severity: "Moderate",
    status: "Resolved",
    reported: "2 days ago",
    reportedBy: "Usman Tariq",
    lat: 24.8,
    lng: 67.05,
  },
];

export const municipalDistricts = [
  { name: "Clifton", open: 31, scheduled: 8, resolved: 42, status: "Good" },
  { name: "Korangi", open: 54, scheduled: 12, resolved: 18, status: "Critical" },
  { name: "Lyari", open: 48, scheduled: 6, resolved: 11, status: "Critical" },
  { name: "Saddar", open: 22, scheduled: 4, resolved: 9, status: "Moderate" },
  { name: "Gulshan", open: 19, scheduled: 3, resolved: 8, status: "Moderate" },
  { name: "Orangi", open: 40, scheduled: 5, resolved: 8, status: "Critical" },
];

export const fleetVehicles = [
  { id: "T-042", driver: "Rashid Ali", status: "Active", route: "Clifton / Sea View", load: 72 },
  { id: "T-019", driver: "Kamran Shah", status: "Active", route: "Korangi Sector 33", load: 64 },
  {
    id: "T-031",
    driver: "Imran Qureshi",
    status: "Maintenance",
    route: "Lyari Riverbank",
    load: 0,
  },
  { id: "T-055", driver: "Sajjad Hussain", status: "Active", route: "Saddar market", load: 45 },
  { id: "T-011", driver: "Farhan Ahmed", status: "Completed", route: "Gulshan-e-Iqbal", load: 0 },
];

export const collectionRoutes = [
  {
    id: "R-101",
    name: "Clifton Beach Loop",
    trucks: 3,
    stops: 12,
    status: "In progress",
    start: "06:00",
    completion: "68%",
  },
  {
    id: "R-205",
    name: "Korangi Industrial Sweep",
    trucks: 4,
    stops: 18,
    status: "In progress",
    start: "05:30",
    completion: "42%",
  },
  {
    id: "R-310",
    name: "Lyari Riverbank Clearance",
    trucks: 2,
    stops: 8,
    status: "Pending",
    start: "08:00",
    completion: "0%",
  },
  {
    id: "R-412",
    name: "Saddar Market Run",
    trucks: 2,
    stops: 10,
    status: "Completed",
    start: "05:00",
    completion: "100%",
  },
];

export const dailyIssueVolume = [
  { day: "Mon", open: 38, resolved: 14 },
  { day: "Tue", open: 42, resolved: 18 },
  { day: "Wed", open: 56, resolved: 22 },
  { day: "Thu", open: 48, resolved: 20 },
  { day: "Fri", open: 62, resolved: 16 },
  { day: "Sat", open: 34, resolved: 12 },
  { day: "Sun", open: 28, resolved: 10 },
];

export const issueStatusSplit = [
  { name: "Open", value: 214, color: "var(--color-destructive)" },
  { name: "Scheduled", value: 38, color: "var(--color-amber)" },
  { name: "Resolved", value: 96, color: "var(--color-primary)" },
];
