export type Role =
  | "ADMIN"
  | "ADMIN_STAFF"
  | "METER_READER"
  | "CASHIER"
  | "MANAGER"
  | "CUSTOMER";

export interface JwtPayload {
  id: number;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
  name?: string;
  password?: string;
  phone?: string | null;
  nic?: string | null;
}
