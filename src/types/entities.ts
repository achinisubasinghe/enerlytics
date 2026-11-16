import type { Role } from "./auth";

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: Role;
  phone?: string | null;
  nic?: string | null;
  created_at?: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  nic?: string | null;
  address?: string | null;
  customer_type?: string;
  created_at?: string;
}

export interface Meter {
  id: number;
  meter_number: string;
  status: string;
  utility_type: string;
  unit?: string;
  created_at?: string;
  customer_name?: string | null;
}

export interface Tariff {
  id: number;
  name: string;
  utility_type: string;
  status: string;
  fixed_charge?: number;
  rate_per_unit?: number;
}

export interface TariffSlab {
  id?: number;
  tariff_id?: number;
  min_units: number;
  max_units: number | null;
  rate_per_unit: number;
  fixed_charge?: number;
  min?: number;
  max?: number;
  rate?: number;
  fixed?: number;
}

export interface Bill {
  id: number;
  meter_id: number;
  customer_id: number | null;
  previous_reading: number;
  current_reading: number;
  units_used: number;
  bill_amount: number;
  status: string;
  createdAt?: string;
  billing_date?: string;
  customer_name?: string;
  customer_email?: string;
  customer_address?: string;
  meter_number?: string;
  utility_type?: string;
}

export interface Payment {
  id: number;
  bill_id: number;
  amount: number;
  payment_method: string;
  payment_date: string;
  reference_number?: string | null;
  notes?: string | null;
  recorded_by?: number;
  bill_amount?: number;
  customer_name?: string;
  meter_number?: string;
  utility_type?: string;
}

export interface Complaint {
  id: number;
  customer_id: number;
  subject: string;
  complaint_text: string;
  status: string;
  resolution_notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface MeterReading {
  id: number;
  meter_id: number;
  reading_date: string;
  previous_reading: number;
  current_reading: number;
  units_used: number;
  bill_amount: number;
}
