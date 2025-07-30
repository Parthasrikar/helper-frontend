export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

export enum DocType {
  ADHAAR = 'adhaar',
  PAN = 'pan',
  VOTER = 'voter',
  PASSPORT = 'passport'
}

export enum VehiclesType {
  NONE = 'none',
  BIKE = 'bike',
  AUTO = 'auto',
  CAR = 'car'
}

export enum Roles {
  MAID = 'maid',
  COOK = 'cook',
  DRIVER = 'driver',
  NURSE = 'nurse'
}

export interface Helper {
  _id: string;
  id: string;
  name: string;
  typeOfService: Roles;
  organization: string;
  phone: string;
  email: string;
  gender: GenderEnum;
  languages: string[];
  employeeId: number;
  joinedDate?: string;       // ISO date from API
  type: VehiclesType;
  status: DocType;
  kycUrl?: string;
  kycFileName?: string;
  kycUploadedAt?: string;    // ISO date from API
  createdAt?: string;        // ISO date from API
  updatedAt?: string;        // ISO date from API
}
