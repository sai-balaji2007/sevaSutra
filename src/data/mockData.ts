import { Beneficiary, CaregiverDelegation, CaregiverAuditLog, GrievancePetition, FailureDiagnostic } from '../types';

export const INITIAL_BENEFICIARIES: Beneficiary[] = [
  {
    id: 'BEN-1001',
    pensionId: 'AP-OAP-2024-884920',
    aadhaarLastFour: '4912',
    name: 'Lakshmi Devi M.',
    age: 68,
    gender: 'Female',
    category: 'Elderly',
    scheme: 'IGNOAPS',
    schemeTitle: 'Indira Gandhi National Old Age Pension (IGNOAPS)',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    villageOrWard: 'Pendurthi Ward 12',
    monthlyAmount: 3250,
    bankName: 'State Bank of India',
    accountLastFour: '3819',
    ifscCode: 'SBIN0001234',
    npciAadhaarSeeded: false, // Inactive mapping after bank branch merger
    jeevanPramaanValidUntil: '2026-11-30',
    activeStatus: true,
    timeline: [
      {
        stage: 'Application',
        status: 'completed',
        date: '2024-03-15',
        description: 'Sanction letter issued by District Social Welfare Office'
      },
      {
        stage: 'Panchayat_Sanction',
        status: 'completed',
        date: '2024-03-28',
        description: 'Ward Sachivalayam bi-monthly physical verification verified'
      },
      {
        stage: 'PFMS_Validation',
        status: 'completed',
        date: '2024-04-05',
        description: 'Public Financial Management System validated beneficiary credentials'
      },
      {
        stage: 'NPCI_Bridge',
        status: 'failed',
        date: '2026-09-02',
        description: 'Direct Benefit Transfer (DBT) returned with status code: AB-01 (Aadhaar Not Seeded in NPCI Mapper)'
      },
      {
        stage: 'Bank_Credit',
        status: 'pending',
        date: '2026-10-01',
        description: 'Awaiting NPCI mapper re-activation'
      }
    ],
    paymentHistory: [
      {
        id: 'PAY-2026-10',
        month: 'October 2026',
        amount: 3250,
        status: 'FAILED',
        bankName: 'State Bank of India',
        failureReason: 'DBT Payment Return: Aadhaar unmapped from NPCI APBS (Aadhaar Payment Bridge)',
        diagnosticCode: 'NPCI_UNSEEDED'
      },
      {
        id: 'PAY-2026-09',
        month: 'September 2026',
        amount: 3250,
        status: 'FAILED',
        bankName: 'State Bank of India',
        failureReason: 'DBT Payment Return: Aadhaar unmapped from NPCI APBS',
        diagnosticCode: 'NPCI_UNSEEDED'
      },
      {
        id: 'PAY-2026-08',
        month: 'August 2026',
        amount: 3250,
        status: 'CREDITED',
        dateDisbursed: '2026-08-01',
        utrNumber: 'SBIN9841209384',
        bankName: 'State Bank of India'
      },
      {
        id: 'PAY-2026-07',
        month: 'July 2026',
        amount: 3250,
        status: 'CREDITED',
        dateDisbursed: '2026-07-01',
        utrNumber: 'SBIN7728104829',
        bankName: 'State Bank of India'
      }
    ]
  },
  {
    id: 'BEN-1002',
    pensionId: 'TS-DIS-2023-772911',
    aadhaarLastFour: '7104',
    name: 'K. Venkata Ramana',
    age: 44,
    gender: 'Male',
    category: 'Person with Disability',
    scheme: 'IGNDPS',
    schemeTitle: 'Indira Gandhi National Disability Pension (IGNDPS) / Aasara',
    district: 'Warangal',
    state: 'Telangana',
    villageOrWard: 'Narsampet Rural',
    monthlyAmount: 4016,
    bankName: 'Union Bank of India',
    accountLastFour: '9041',
    ifscCode: 'UBIN0542311',
    npciAadhaarSeeded: true,
    jeevanPramaanValidUntil: '2026-09-15', // EXPIRED!
    udidCardNumber: 'TS-24-UDID-99214',
    disabilityPercentage: 75,
    activeStatus: true,
    timeline: [
      {
        stage: 'Application',
        status: 'completed',
        date: '2023-08-10',
        description: 'UDID certificate verified with 75% locomotor impairment'
      },
      {
        stage: 'Panchayat_Sanction',
        status: 'completed',
        date: '2023-09-01',
        description: 'Mandal Parishad Development Officer sanction approved'
      },
      {
        stage: 'PFMS_Validation',
        status: 'completed',
        date: '2023-09-14',
        description: 'PFMS Account & IFSC verified'
      },
      {
        stage: 'NPCI_Bridge',
        status: 'completed',
        date: '2023-10-01',
        description: 'DBT Aadhaar enabled'
      },
      {
        stage: 'Bank_Credit',
        status: 'failed',
        date: '2026-10-02',
        description: 'Life Certificate (Jeevan Pramaan) expired. Annual biometric re-certification required.'
      }
    ],
    paymentHistory: [
      {
        id: 'PAY-2026-10',
        month: 'October 2026',
        amount: 4016,
        status: 'ON_HOLD',
        bankName: 'Union Bank of India',
        failureReason: 'Annual Life Certificate (DLC) validation expired on 15-Sept-2026',
        diagnosticCode: 'DLC_EXPIRED'
      },
      {
        id: 'PAY-2026-09',
        month: 'September 2026',
        amount: 4016,
        status: 'CREDITED',
        dateDisbursed: '2026-09-02',
        utrNumber: 'UBIN4491029311',
        bankName: 'Union Bank of India'
      },
      {
        id: 'PAY-2026-08',
        month: 'August 2026',
        amount: 4016,
        status: 'CREDITED',
        dateDisbursed: '2026-08-01',
        utrNumber: 'UBIN3381902481',
        bankName: 'Union Bank of India'
      }
    ]
  },
  {
    id: 'BEN-1003',
    pensionId: 'AP-WID-2022-339108',
    aadhaarLastFour: '8833',
    name: 'S. Shanthamma',
    age: 72,
    gender: 'Female',
    category: 'Widow',
    scheme: 'IGNWPS',
    schemeTitle: 'Indira Gandhi National Widow Pension Scheme',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    villageOrWard: 'Tenali Town Ward 4',
    monthlyAmount: 3000,
    bankName: 'Canara Bank',
    accountLastFour: '6521',
    ifscCode: 'CNRB0001844',
    npciAadhaarSeeded: true,
    jeevanPramaanValidUntil: '2027-03-31',
    activeStatus: true,
    timeline: [
      {
        stage: 'Application',
        status: 'completed',
        date: '2022-04-10',
        description: 'Sanctioned under Social Welfare Department'
      },
      {
        stage: 'Panchayat_Sanction',
        status: 'completed',
        date: '2022-04-20',
        description: 'Municipal commissioner verified'
      },
      {
        stage: 'PFMS_Validation',
        status: 'completed',
        date: '2022-05-01',
        description: 'PFMS Account verified'
      },
      {
        stage: 'NPCI_Bridge',
        status: 'completed',
        date: '2022-05-05',
        description: 'Active Aadhaar Payment Bridge'
      },
      {
        stage: 'Bank_Credit',
        status: 'completed',
        date: '2026-10-01',
        description: 'October pension disbursed on schedule'
      }
    ],
    paymentHistory: [
      {
        id: 'PAY-2026-10',
        month: 'October 2026',
        amount: 3000,
        status: 'CREDITED',
        dateDisbursed: '2026-10-01',
        utrNumber: 'CNRB9910482910',
        bankName: 'Canara Bank'
      },
      {
        id: 'PAY-2026-09',
        month: 'September 2026',
        amount: 3000,
        status: 'CREDITED',
        dateDisbursed: '2026-09-01',
        utrNumber: 'CNRB8817291041',
        bankName: 'Canara Bank'
      }
    ]
  }
];

export const INITIAL_CAREGIVERS: CaregiverDelegation[] = [
  {
    id: 'CG-01',
    beneficiaryId: 'BEN-1001',
    caregiverName: 'M. Suresh Kumar',
    relationship: 'Son / Primary Family Caregiver',
    phoneNumber: '+91 98480 22331',
    accessLevel: 'ASSIST_SUBMIT',
    validUntil: '2027-10-01',
    status: 'ACTIVE',
    canCheckPayments: true,
    canUploadDocuments: true,
    canFileGrievances: true,
    canChangeBankDetails: false, // Locked for beneficiary safety
    addedOn: '2025-01-10',
    notes: 'Authorized to assist with digital life certificate & grievance filing.'
  },
  {
    id: 'CG-02',
    beneficiaryId: 'BEN-1001',
    caregiverName: 'Anil Babu (VRO Assistant)',
    relationship: 'Village Sachivalayam Volunteer',
    phoneNumber: '+91 94401 55662',
    accessLevel: 'VIEW_ONLY',
    validUntil: '2026-12-31',
    status: 'ACTIVE',
    canCheckPayments: true,
    canUploadDocuments: false,
    canFileGrievances: false,
    canChangeBankDetails: false,
    addedOn: '2026-06-15',
    notes: 'Local ward volunteer checking DBT dispatch updates only.'
  }
];

export const INITIAL_AUDIT_LOGS: CaregiverAuditLog[] = [
  {
    id: 'AUD-901',
    timestamp: '2026-10-23 18:42 IST',
    caregiverName: 'M. Suresh Kumar (Son)',
    action: 'Ran Payment Failure Diagnostic',
    ipLocation: 'Visakhapatnam (Jio Mobile)',
    details: 'Diagnosed DBT return error AB-01 for October pension.',
    securityFlag: 'NORMAL'
  },
  {
    id: 'AUD-902',
    timestamp: '2026-10-20 11:15 IST',
    caregiverName: 'Anil Babu (Volunteer)',
    action: 'Viewed Pension Disbursement Timeline',
    ipLocation: 'Pendurthi Sachivalayam Center',
    details: 'Checked last 6 months transaction ledger.',
    securityFlag: 'NORMAL'
  },
  {
    id: 'AUD-903',
    timestamp: '2026-10-18 14:02 IST',
    caregiverName: 'Unknown System Device',
    action: 'Bank Modification Request BLOCKED',
    ipLocation: 'Unknown Gateway',
    details: 'Automatic protection: Caregivers cannot alter bank accounts or PINs directly.',
    securityFlag: 'ALERT'
  }
];

export const KNOWLEDGE_BASE_DIAGNOSTICS: Record<string, FailureDiagnostic> = {
  NPCI_UNSEEDED: {
    errorCode: 'NPCI_UNSEEDED',
    title: 'Aadhaar Not Seeded in NPCI Payment Bridge (DBT Error AB-01)',
    severity: 'CRITICAL',
    summary: 'The government treasury sent your monthly pension, but your bank account is not linked to receive Direct Benefit Transfer (DBT) via the National Payments Corporation of India (NPCI) gateway.',
    symptomEncountered: 'Status shows "Rejected by DBT Gateway / NPCI Inactive". Earlier payments may have worked, but stopped following branch merger or KYC dormancy.',
    rootCause: 'Having an Aadhaar linked to your bank account for KYC is NOT the same as Aadhaar DBT Seeding on the NPCI mapper. After bank mergers (e.g., Andhra Bank into UBI, or Syndicate Bank into Canara), the backend NPCI mandate frequently drops.',
    actionSteps: [
      {
        stepNumber: 1,
        title: 'Submit NPCI DBT Seeding Mandate Form at your Bank Branch',
        detail: 'Visit your home bank branch with physical Aadhaar card and Passbook. Request the "Aadhaar Seeding / NPCI Mapper Consent Form" (also called Annexure I for DBT).',
        officeToVisit: 'Your Bank Home Branch or India Post Payments Bank (IPPB)',
        documentsRequired: ['Aadhaar Card Copy', 'Bank Passbook Original & Copy', 'Active Mobile Number'],
        isDigitalSelfService: false
      },
      {
        stepNumber: 2,
        title: 'Alternative Fast Route: Open zero-balance IPPB Account',
        detail: 'If your commercial bank branch is slow or crowded, call your local Postman. India Post Payments Bank (IPPB) postmen can link Aadhaar DBT right at your doorstep in 5 minutes using biometric e-KYC.',
        officeToVisit: 'Local Post Office or Postman Doorstep Service (Dial 155299)',
        documentsRequired: ['Aadhaar Number', 'Biometric Fingerprint/Face'],
        isDigitalSelfService: true
      },
      {
        stepNumber: 3,
        title: 'Check Status on UIDAI or myAadhaar Portal',
        detail: 'Verify bank seeding status at resident.uidai.gov.in/bank-mapper after 48-72 hours.',
        documentsRequired: ['Aadhaar Number', 'OTP on Aadhaar-linked mobile'],
        isDigitalSelfService: true
      }
    ],
    officialGrievanceDraft: {
      subject: 'Urgent Request for NPCI Aadhaar Mapping & Release of Withheld Pension for AP-OAP-2024-884920',
      authorityAddressed: 'The Branch Manager, State Bank of India & Project Director, District DRDA / Social Welfare',
      bodyText: `Respected Sir/Madam,

I am Lakshmi Devi M., an elderly pensioner holding Pension ID AP-OAP-2024-884920. My monthly pension for September & October 2026 has failed to credit due to DBT error "Aadhaar Not Seeded in NPCI Mapper (AB-01)".

I am submitting herewith my Aadhaar Card photocopy and signed NPCI Consent Mandate Form. Kindly immediately seed my Account No. ending in 3819 into the NPCI Central Mapper for Direct Benefit Transfer so that my withheld subsistence allowance can be credited.

Thanking you,
Yours sincerely,
Lakshmi Devi M.`
    }
  },
  DLC_EXPIRED: {
    errorCode: 'DLC_EXPIRED',
    title: 'Digital Life Certificate (Jeevan Pramaan) Overdue',
    severity: 'WARNING',
    summary: 'Your annual life certificate submission has expired. As per government rules, pension disbursements are temporarily held until digital or physical life proof is recorded.',
    symptomEncountered: 'Pension status displays "Held pending Annual Verification / Jeevan Pramaan submission".',
    rootCause: 'All pensioners must submit a life certificate once every 12 months. When the deadline passes without verification, the treasury locks payments to prevent fraudulent claims.',
    actionSteps: [
      {
        stepNumber: 1,
        title: 'Use Smartphone Face Authentication (No Fingerprint Machine Needed)',
        detail: 'Download the official "Jeevan Pramaan Face App" and "AadhaarFaceRD" from Google Play Store on any Android smartphone. Use the front camera to blink and verify in under 60 seconds from your home.',
        documentsRequired: ['Aadhaar Number', 'PPO/Pension Number', 'Camera-enabled Phone'],
        isDigitalSelfService: true
      },
      {
        stepNumber: 2,
        title: 'Doorstep Service by Postman (IPPB)',
        detail: 'Request your beat postman to visit your home with the micro-ATM machine. A nominal fee of ₹50 or free government quota provides instant digital certificate generation.',
        officeToVisit: 'Local Post Office or Book on Postinfo App',
        documentsRequired: ['Aadhaar Card', 'Pension Order Book / PPO'],
        isDigitalSelfService: true
      },
      {
        stepNumber: 3,
        title: 'Ward / Grama Sachivalayam Biometric Kiosk',
        detail: 'Visit your nearest village secretariat where the Welfare Assistant or Iris Scanner can verify you if fingerprint ridges are worn down due to age or manual labor.',
        officeToVisit: 'Grama / Ward Sachivalayam or CSC Center',
        documentsRequired: ['Aadhaar Card', 'Pension Card'],
        isDigitalSelfService: false
      }
    ],
    officialGrievanceDraft: {
      subject: 'Intimation of Digital Life Certificate Submission & Request to Resume Monthly Pension',
      authorityAddressed: 'The District Treasury Officer / Mandal Parishad Development Officer (MPDO)',
      bodyText: `Respected Authority,

I am K. Venkata Ramana, beneficiary of Disability Pension ID TS-DIS-2023-772911. My October 2026 pension was placed on hold due to Jeevan Pramaan expiry.

I have now successfully submitted my Digital Life Certificate using Face Authentication on the Jeevan Pramaan portal. The Pramaan ID is JP-2026-904128.

Kindly verify the submission on the treasury portal and release my held pension along with current dues at the earliest.

Yours faithfully,
K. Venkata Ramana`
    }
  },
  PFMS_NAME_MISMATCH: {
    errorCode: 'PFMS_NAME_MISMATCH',
    title: 'Name Spelling Mismatch Between Aadhaar and Bank Account',
    severity: 'CRITICAL',
    summary: 'The Public Financial Management System (PFMS) failed validation because the spelling of your name in the bank records does not match the spelling on your Aadhaar card.',
    symptomEncountered: 'Status: "PFMS Validation Failed - Account Name Not Matching with Beneficiary Master".',
    rootCause: 'Even small discrepancies (e.g. initials like "K. Rao" vs "Kolla Rao" or title variations) trigger automated DBT rejection by bank security filters.',
    actionSteps: [
      {
        stepNumber: 1,
        title: 'Get Bank Account Name Correction / KYC Alignment',
        detail: 'Submit a copy of your Aadhaar card at your bank and request the officer to update the Customer Information File (CIF) name to strictly match Aadhaar spelling.',
        officeToVisit: 'Bank Home Branch',
        documentsRequired: ['Aadhaar Original', 'PAN or Form 60', 'Passbook'],
        isDigitalSelfService: false
      },
      {
        stepNumber: 2,
        title: 'Update Panchayat / Welfare Department Records',
        detail: 'Submit the updated bank passbook front page to the Welfare Assistant at your local Sachivalayam to trigger PFMS re-validation.',
        officeToVisit: 'Local Panchayat / Ward Office',
        documentsRequired: ['Updated Bank Passbook Copy', 'Aadhaar Copy'],
        isDigitalSelfService: false
      }
    ],
    officialGrievanceDraft: {
      subject: 'Rectification of Name in PFMS Records for Pension Account',
      authorityAddressed: 'The District Social Welfare Officer',
      bodyText: `Respected Sir/Madam,

My pension disbursal has faced delay due to a minor name format difference between Aadhaar and bank passbook. I have rectified my bank records as per my Aadhaar card.

Attached are copies of my Aadhaar card and verified bank passbook. Kindly initiate PFMS re-validation for my pension ID.

Yours sincerely,
Beneficiary`
    }
  }
};
