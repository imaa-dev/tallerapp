import { Organization } from "../organization/organization.type";
import { User } from "../user/user.type";

export type LoginSuccessResponse = {
  success: true;
  token: string;
  user: User;
};

export type LoginMultiOrgResponse = {
  success: false;
  login_id: string;
  user: User;
  organizations: Organization[];
};

export type LoginResponse = LoginSuccessResponse | LoginMultiOrgResponse;

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  nameOrganization: string;
  workshop_type_id: number;
};
