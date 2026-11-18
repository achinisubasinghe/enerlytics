import {
  date,
  datetime,
  decimal,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  nic: varchar("nic", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customers = mysqlTable("customers", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }),
  nic: varchar("nic", { length: 50 }),
  address: text("address"),
  customerType: varchar("customer_type", { length: 50 }).default("HOUSEHOLD").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const meters = mysqlTable("meters", {
  id: int("id").primaryKey().autoincrement(),
  meterNumber: varchar("meter_number", { length: 100 }).notNull().unique(),
  status: varchar("status", { length: 50 }).default("ACTIVE").notNull(),
  utilityType: varchar("utility_type", { length: 50 }).notNull(),
  unit: varchar("unit", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const meterCustomerAssignments = mysqlTable("meter_customer_assignments", {
  id: int("id").primaryKey().autoincrement(),
  meterId: int("meter_id")
    .notNull()
    .references(() => meters.id),
  customerId: int("customer_id")
    .notNull()
    .references(() => customers.id),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  unassignedAt: timestamp("unassigned_at"),
});

export const meterReaderAssignments = mysqlTable("meter_reader_assignments", {
  id: int("id").primaryKey().autoincrement(),
  meterId: int("meter_id")
    .notNull()
    .references(() => meters.id),
  meterReaderId: int("meter_reader_id")
    .notNull()
    .references(() => users.id),
  period: varchar("period", { length: 20 }).notNull(),
  status: varchar("status", { length: 50 }).default("PENDING").notNull(),
});

export const meterReadings = mysqlTable("meter_readings", {
  id: int("id").primaryKey().autoincrement(),
  meterId: int("meter_id")
    .notNull()
    .references(() => meters.id),
  readingDate: date("reading_date").notNull(),
  previousReading: decimal("previous_reading", { precision: 12, scale: 2 }).notNull(),
  currentReading: decimal("current_reading", { precision: 12, scale: 2 }).notNull(),
  unitsUsed: decimal("units_used", { precision: 12, scale: 2 }).notNull(),
  billAmount: decimal("bill_amount", { precision: 12, scale: 2 }).default("0").notNull(),
});

export const tariffs = mysqlTable("tariffs", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  utilityType: varchar("utility_type", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).default("ACTIVE").notNull(),
  fixedCharge: decimal("fixed_charge", { precision: 12, scale: 2 }),
  ratePerUnit: decimal("rate_per_unit", { precision: 12, scale: 4 }),
});

export const tariffSlabs = mysqlTable("tariff_slabs", {
  id: int("id").primaryKey().autoincrement(),
  tariffId: int("tariff_id")
    .notNull()
    .references(() => tariffs.id),
  minUnits: decimal("min_units", { precision: 12, scale: 2 }).notNull(),
  maxUnits: decimal("max_units", { precision: 12, scale: 2 }),
  ratePerUnit: decimal("rate_per_unit", { precision: 12, scale: 4 }).notNull(),
  fixedCharge: decimal("fixed_charge", { precision: 12, scale: 2 }).default("0"),
});

export const bills = mysqlTable("bills", {
  id: int("id").primaryKey().autoincrement(),
  meterId: int("meter_id")
    .notNull()
    .references(() => meters.id),
  customerId: int("customer_id").references(() => customers.id),
  previousReading: decimal("previous_reading", { precision: 12, scale: 2 }).notNull(),
  currentReading: decimal("current_reading", { precision: 12, scale: 2 }).notNull(),
  unitsUsed: decimal("units_used", { precision: 12, scale: 2 }).notNull(),
  billAmount: decimal("bill_amount", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("NOT PAID").notNull(),
  createdAt: date("createdAt").notNull(),
});

export const payments = mysqlTable("payments", {
  id: int("id").primaryKey().autoincrement(),
  billId: int("bill_id")
    .notNull()
    .references(() => bills.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  paymentDate: datetime("payment_date").notNull(),
  referenceNumber: varchar("reference_number", { length: 100 }),
  notes: text("notes"),
  recordedBy: int("recorded_by").references(() => users.id),
});

export const complaints = mysqlTable("complaints", {
  id: int("id").primaryKey().autoincrement(),
  customerId: int("customer_id")
    .notNull()
    .references(() => customers.id),
  subject: varchar("subject", { length: 255 }).notNull(),
  complaintText: text("complaint_text").notNull(),
  status: varchar("status", { length: 50 }).default("PENDING").notNull(),
  response: text("response"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
