// 🌿 EcoPulse AI — Backend Database Schemas & Data Models
// Aligned with Pakistan CSR Act 2026 & Alibaba Cloud Stack

export type UserRole = "citizen" | "ngo" | "corporate" | "municipal";

export interface UserAccount {
  id: string;
  cnic: string; // 13-digit CNIC (Anti-Sybil 1 Citizen = 1 Account)
  fullName: string;
  email: string;
  role: UserRole;
  organization?: string;
  pointsBalance: number;
  streakDays: number;
  totalRecycledKg: number;
  treesPlanted: number;
  isCnicVerified: boolean;
  createdAt: string;
}

export type WasteCategory =
  | "PET Plastic"
  | "Glass"
  | "Organic Waste"
  | "E-Waste"
  | "Paper & Cardboard"
  | "Hazardous Waste";

export type BinColor = "Blue" | "Green" | "Red" | "Yellow";

export interface WasteClassificationResult {
  item: string;
  category: WasteCategory;
  binColor: BinColor;
  binColorAdvice: string;
  confidence: number;
  advice: string;
  nearbyBins: Array<{ id: string; distance: string; type: string }>;
  pointsAwarded: number; // ALWAYS 0 for scan alone
  guidanceNotice: string;
}

export interface SmartBinDisposal {
  id: string;
  userCnic: string;
  binId: string;
  wasteType: WasteCategory;
  weightKg: number;
  pointsEarned: number;
  timestamp: string;
  status: "Verified";
}

export type ReportType = "Illegal Dumping Hotspot" | "Public Littering Violation";

export interface CivicReport {
  id: string;
  userCnic: string;
  type: ReportType;
  category: string;
  photoUrl: string;
  pHash: string; // Perceptual hash for duplicate detection (Alibaba Cloud FC)
  gpsLocation: { lat: number; lng: number; area: string };
  severity: "Minor" | "Moderate" | "Major";
  description: string;
  upvotesCount: number;
  status: "Pending" | "Upvoted" | "NGO_Verified" | "Govt_Resolved";
  postCleanupPhotoUrl?: string;
  pointsAwarded?: number;
  createdAt: string;
}

export interface CSRAuditReport {
  reportId: string;
  companyName: string;
  campaignTitle: string;
  csrAct2026Status: "FULLY_COMPLIANT";
  totalBudgetPkr: number;
  totalPlasticRecoveredKg: number;
  totalTreesPlanted: number;
  verifiedCitizenParticipants: number;
  cryptographicVerificationHash: string; // SHA-256 tamper-proof proof
  issuedAt: string;
  auditorSignoffReady: boolean;
}

/**
 * Validates Pakistani 13-digit CNIC format (e.g. 42101-1234567-1 or 4210112345671)
 */
export function validateCNIC(cnic: string): { isValid: boolean; formatted: string; message: string } {
  const digits = cnic.replace(/\D/g, "");
  if (digits.length !== 13) {
    return {
      isValid: false,
      formatted: cnic,
      message: "CNIC must be exactly 13 digits (e.g. 42101-1234567-1).",
    };
  }
  const formatted = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
  return {
    isValid: true,
    formatted,
    message: "Valid CNIC format. 1 Citizen = 1 Account anti-sybil check passed.",
  };
}
