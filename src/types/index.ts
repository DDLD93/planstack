// Enums
export enum PropertyType {
  Residential = 'Residential',
  Commercial = 'Commercial',
  Industrial = 'Industrial',
  Agricultural = 'Agricultural',
  Mixed = 'Mixed'
}

export enum DevelopmentStatus {
  Developed = 'Developed',
  UnderDevelopment = 'UnderDevelopment',
  Undeveloped = 'Undeveloped'
}

export enum OccupancyStatus {
  Occupied = 'Occupied',
  Vacant = 'Vacant',
  PartiallyOccupied = 'PartiallyOccupied'
}

export enum TaxStatus {
  Paid = 'Paid',
  Unpaid = 'Unpaid',
  PartiallyPaid = 'PartiallyPaid',
  Exempted = 'Exempted'
}

export enum ValidationStatus {
  Pending = 'Pending',
  Validated = 'Validated',
  Rejected = 'Rejected'
}

export enum SyncStatus {
  Local = 'Local',
  Synced = 'Synced',
  PendingSync = 'PendingSync',
  SyncFailed = 'SyncFailed'
}

// Types
export interface CoOwner {
  name: string;
  nationalId: string;
  phoneNumber: string;
  ownershipPercentage: number;
}

export interface DataModification {
  timestamp: string;
  field: string;
  oldValue: any;
  newValue: any;
  modifiedBy: string;
}

export interface BillingRecord {
  billId: string;
  amount: number;
  dueDate: string;
  status: TaxStatus;
  paymentDate?: string;
  paymentMethod?: string;
}

export interface OwnerComplaint {
  complaintId: string;
  timestamp: string;
  category: string;
  description: string;
  status: string;
  resolution?: string;
}

export interface PropertySegment {
  segmentId: string;
  category: string;
  value: number;
  characteristics: string[];
}

export interface GeospatialData {
  dataId: string;
  timestamp: string;
  type: string;
  coordinates: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  metadata: Record<string, any>;
}

export interface Facility{
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
  region: string;

  propertyType: PropertyType;
  propertySize: number;
  propertyValue?: number;
  propertyValueRange?: string;
  developmentStatus: DevelopmentStatus;
  businessOperated?: string;
  businessType?: string;
  occupancyStatus: OccupancyStatus;
  numberOfUnits?: number;
  multipleOwnership: boolean;
  coOwners?: CoOwner[];

  taxLevyCategory: string;
  taxLevyAmount: number;
  taxStatus: TaxStatus;
  marketValueAssessment: number;
  annualRate: number;
  reliefRate: number;
  imageOfProperty: string;
  ownerSignature?: string;
  dataValidationStatus: ValidationStatus;
  dataModificationHistory?: DataModification[];
  billingHistory?: BillingRecord[];
  ownerComplaintsFeedback?: OwnerComplaint[];
  propertySegmentationData?: PropertySegment[];
  geospatialAnalysisData?: GeospatialData[];
}

export interface CustomerState {
    streetName: string;
    lga: string;
    ward: string;
    longitude: number;
    latitude: number;
    altitude: number;
    facilities?: Facility[];
    dateOfEnumeration: string;
    timeOfEnumeration: string;
    syncStatus: SyncStatus;
    
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'enumerator';
}