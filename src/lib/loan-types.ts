export interface LoanApplication {
  id: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected" | "review";

  // Personal
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  address: string;
  city: string;
  state: string;
  nationality: string;

  // Employment
  employmentStatus: string;
  employerName: string;
  jobTitle: string;
  monthlyIncome: string;
  workAddress: string;
  yearsEmployed: string;

  // Loan
  loanAmount: string;
  loanPurpose: string;
  loanTerm: string;
  repaymentSource: string;

  // Next of Kin
  kinFullName: string;
  kinRelationship: string;
  kinPhone: string;
  kinAddress: string;

  // Bank
  bankName: string;
  accountNumber: string;
  accountName: string;
  bvn: string;

  // Files (data URLs in mock backend; URLs from real backend)
  passportPhoto?: string;
  passportPhotoName?: string;
  idDocument?: string;
  idDocumentName?: string;
  proofOfIncome?: string;
  proofOfIncomeName?: string;
  proofOfAddress?: string;
  proofOfAddressName?: string;
}

export type LoanApplicationDraft = Omit<LoanApplication, "id" | "createdAt" | "status">;