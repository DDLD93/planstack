export interface PropertyRecord {
  propertyId: string;
  ownerName: string;
  nationalIdentificationNumber: string;
  phoneNumber1: string;
  phoneNumber2?: string;
  emailAddress?: string;
  physicalAddress: string;
  gpsLatitude: number;
  gpsLongitude: number;
  gpsAltitude?: number;
  gpsPrecision?: number;
  geocodedAddress: string;
  propertyType: 'Residential' | 'Commercial' | 'Industrial' | 'Agricultural' | 'Mixed Use' | 'Undeveloped';
  propertySize: number; // in square meters
  propertyValue?: number;
  developmentStatus: 'Developed' | 'Undeveloped' | 'Partially Developed';
  businessOperated?: string;
  businessType?: string;
  occupancyStatus: 'Occupied' | 'Vacant' | 'Partially Occupied';
  numberOfUnits?: number;
  region: string;
  lga: string;
  ward: string;
  multipleOwnership: boolean;
  coOwners?: { name: string; contact: string; share: number }[];
  taxLevyCategory: string;
  taxLevyAmount: number;
  taxStatus: 'Paid' | 'Unpaid' | 'Partially Paid' | 'Exempt';
  dateOfEnumeration: string;
  timeOfEnumeration: string;
  imageOfProperty: string;
  ownerSignature?: string;
  dataValidationStatus: 'Pending' | 'Validated' | 'Rejected';
  dataModificationHistory?: { date: string; user: string; changes: string }[];
  billingHistory?: { date: string; amount: number; status: string }[];
  ownerComplaintsFeedback?: { date: string; complaint: string; status: string }[];
  propertySegmentationData?: { segment: string; probability: number }[];
  geospatialAnalysisData?: { type: string; coordinates: number[] }[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'enumerator';
}