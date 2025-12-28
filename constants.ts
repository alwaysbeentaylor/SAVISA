
import { FormData } from './types';

export const INITIAL_FORM_DATA: FormData = {
  firstName: '',
  lastName: '',
  dob: '',
  nationality: '',
  gender: '',
  email: '',
  phone: '',
  passportNumber: '',
  passportIssueDate: '',
  passportExpiryDate: '',
  arrivalDate: '',
  departureDate: '',
  accommodationAddress: '',
  purposeOfVisit: 'Tourism',
  criminalRecord: false,
  previousDeportation: false,
  healthConditions: false,
};

export const STEPS = [
  'Welcome',
  'Personal',
  'Passport',
  'Travel',
  'Security',
  'Review',
  'Payment'
];

export const NATIONALITIES = [
  'United Kingdom', 'United States', 'Germany', 'France', 'Netherlands', 'Canada', 'Australia', 'China', 'India', 'Brazil'
];

export const PURPOSES = [
  'Tourism', 'Business', 'Medical Treatment', 'Visiting Family/Friends', 'Transit'
];
