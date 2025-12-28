
export enum ApplicationStep {
  START = 0,
  PERSONAL_INFO = 1,
  PASSPORT_INFO = 2,
  TRAVEL_INFO = 3,
  SECURITY_QUESTIONS = 4,
  REVIEW = 5,
  PAYMENT = 6,
  SUBMITTED = 7
}

export interface FormData {
  firstName: string;
  lastName: string;
  dob: string;
  nationality: string;
  gender: string;
  email: string;
  phone: string;
  passportNumber: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  arrivalDate: string;
  departureDate: string;
  accommodationAddress: string;
  purposeOfVisit: string;
  criminalRecord: boolean;
  previousDeportation: boolean;
  healthConditions: boolean;
}

export interface AIReviewResult {
  status: 'valid' | 'warning' | 'error';
  suggestions: string[];
  summary: string;
}
