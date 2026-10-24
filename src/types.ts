export type Language = 'en' | 'te' | 'hi';

export type BenefitScheme = 
  | 'IGNOAPS' // Indira Gandhi National Old Age Pension
  | 'IGNWPS' // Indira Gandhi National Widow Pension
  | 'IGNDPS' // Indira Gandhi National Disability Pension
  | 'AASARA' // Telangana Aasara / State Pension
  | 'YSR_KANUKA' // Andhra Pradesh Social Security Pension
  | 'APY'; // Atal Pension Yojana

export type PaymentStatus = 'CREDITED' | 'PROCESSING' | 'FAILED' | 'ON_HOLD';

export interface PaymentRecord {
  id: string;
  month: string;
  amount: number;
  status: PaymentStatus;
  dateDisbursed?: string;
  utrNumber?: string;
  bankName: string;
  failureReason?: string;
  diagnosticCode?: string;
}

export interface Beneficiary {
  id: string;
  pensionId: string;
  aadhaarLastFour: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  category: 'Elderly' | 'Person with Disability' | 'Widow';
  scheme: BenefitScheme;
  schemeTitle: string;
  district: string;
  state: string;
  villageOrWard: string;
  monthlyAmount: number;
  bankName: string;
  accountLastFour: string;
  ifscCode: string;
  npciAadhaarSeeded: boolean;
  jeevanPramaanValidUntil: string; // ISO date string
  udidCardNumber?: string;
  disabilityPercentage?: number;
  activeStatus: boolean;
  timeline: {
    stage: 'Application' | 'Panchayat_Sanction' | 'PFMS_Validation' | 'NPCI_Bridge' | 'Bank_Credit';
    status: 'completed' | 'in_progress' | 'failed' | 'pending';
    date: string;
    description: string;
  }[];
  paymentHistory: PaymentRecord[];
}

export interface FailureDiagnostic {
  errorCode: string;
  title: string;
  severity: 'CRITICAL' | 'WARNING' | 'RESOLVABLE';
  summary: string;
  symptomEncountered: string;
  rootCause: string;
  actionSteps: {
    stepNumber: number;
    title: string;
    detail: string;
    officeToVisit?: string;
    documentsRequired: string[];
    isDigitalSelfService: boolean;
  }[];
  officialGrievanceDraft: {
    subject: string;
    authorityAddressed: string;
    bodyText: string;
  };
}

export type CaregiverAccessLevel = 'VIEW_ONLY' | 'ASSIST_SUBMIT' | 'FULL_CARE';

export interface CaregiverDelegation {
  id: string;
  beneficiaryId: string;
  caregiverName: string;
  relationship: string;
  phoneNumber: string;
  accessLevel: CaregiverAccessLevel;
  validUntil: string;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  canCheckPayments: boolean;
  canUploadDocuments: boolean;
  canFileGrievances: boolean;
  canChangeBankDetails: boolean; // Strictly false for safety
  addedOn: string;
  notes?: string;
}

export interface CaregiverAuditLog {
  id: string;
  timestamp: string;
  caregiverName: string;
  action: string;
  ipLocation: string;
  details: string;
  securityFlag: 'NORMAL' | 'SENSITIVE' | 'ALERT';
}

export interface GrievancePetition {
  id: string;
  trackingNumber: string;
  dateCreated: string;
  beneficiaryName: string;
  pensionId: string;
  authority: string;
  issueCategory: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ESCALATED' | 'RESOLVED';
  expectedTurnaroundDays: number;
  content: string;
}
