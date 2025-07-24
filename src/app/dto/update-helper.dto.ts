import { GenderEnum, Roles, VehiclesType, DocType } from '../model/helper.model';

export interface UpdateHelperDto {
  name?: string;
  typeOfService?: Roles;
  organization?: string;
  phone?: string;
  email?: string;
  gender?: GenderEnum;
  languages?: string[];
  employeeId?: number;
  type?: VehiclesType;
  status?: DocType;
  kycUrl?: string;
}
