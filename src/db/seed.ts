import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  bills,
  complaints,
  customers,
  meterCustomerAssignments,
  meterReaderAssignments,
  meterReadings,
  meters,
  payments,
  tariffSlabs,
  tariffs,
  users,
} from "./schema";

const host = process.env.DB_HOST || "localhost";
const user = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME || "utility_management_system";

const SEED_PASSWORD = "password123";

async function main() {
  const connection = await mysql.createConnection({
    host,
    user,
    password,
    database,
  });

  const db = drizzle(connection, { mode: "default" });

  console.log("Clearing existing data...");
  await connection.query("SET FOREIGN_KEY_CHECKS = 0");
  await connection.query("TRUNCATE TABLE payments");
  await connection.query("TRUNCATE TABLE bills");
  await connection.query("TRUNCATE TABLE complaints");
  await connection.query("TRUNCATE TABLE meter_readings");
  await connection.query("TRUNCATE TABLE meter_reader_assignments");
  await connection.query("TRUNCATE TABLE meter_customer_assignments");
  await connection.query("TRUNCATE TABLE tariff_slabs");
  await connection.query("TRUNCATE TABLE tariffs");
  await connection.query("TRUNCATE TABLE meters");
  await connection.query("TRUNCATE TABLE customers");
  await connection.query("TRUNCATE TABLE users");
  await connection.query("SET FOREIGN_KEY_CHECKS = 1");

  const hashed = await bcrypt.hash(SEED_PASSWORD, 10);

  console.log("Seeding users...");
  await db.insert(users).values([
    {
      name: "System Admin",
      email: "admin@enerlytics.com",
      password: hashed,
      role: "ADMIN",
      phone: "0700000001",
      nic: "900000001V",
    },
    {
      name: "Admin Staff",
      email: "staff@enerlytics.com",
      password: hashed,
      role: "ADMIN_STAFF",
      phone: "0700000002",
      nic: "900000002V",
    },
    {
      name: "Meter Reader",
      email: "reader@enerlytics.com",
      password: hashed,
      role: "METER_READER",
      phone: "0700000003",
      nic: "900000003V",
    },
    {
      name: "Cashier User",
      email: "cashier@enerlytics.com",
      password: hashed,
      role: "CASHIER",
      phone: "0700000004",
      nic: "900000004V",
    },
    {
      name: "Manager User",
      email: "manager@enerlytics.com",
      password: hashed,
      role: "MANAGER",
      phone: "0700000005",
      nic: "900000005V",
    },
    {
      name: "Jane Customer",
      email: "customer@enerlytics.com",
      password: hashed,
      role: "CUSTOMER",
      phone: "0700000006",
      nic: "900000006V",
    },
  ]);

  const [userRows] = await connection.query<mysql.RowDataPacket[]>(
    "SELECT id, email, role FROM users"
  );
  const userByEmail = Object.fromEntries(userRows.map((u) => [u.email, u]));

  console.log("Seeding customers...");
  await db.insert(customers).values([
    {
      name: "Jane Customer",
      email: "customer@enerlytics.com",
      phone: "0700000006",
      nic: "900000006V",
      address: "12 Lake Road, Colombo",
      customerType: "HOUSEHOLD",
    },
    {
      name: "Acme Industries",
      email: "billing@acme.example",
      phone: "0112345678",
      nic: null,
      address: "45 Industrial Zone, Biyagama",
      customerType: "COMMERCIAL",
    },
    {
      name: "John Household",
      email: "john@example.com",
      phone: "0771234567",
      nic: "901234567V",
      address: "8 Palm Grove, Kandy",
      customerType: "HOUSEHOLD",
    },
  ]);

  const [customerRows] = await connection.query<mysql.RowDataPacket[]>(
    "SELECT id, email FROM customers"
  );
  const customerByEmail = Object.fromEntries(customerRows.map((c) => [c.email, c]));

  console.log("Seeding meters...");
  await db.insert(meters).values([
    {
      meterNumber: "ELC-1001",
      status: "ACTIVE",
      utilityType: "ELECTRICITY",
      unit: "kWh",
    },
    {
      meterNumber: "WTR-2001",
      status: "ACTIVE",
      utilityType: "WATER",
      unit: "m³",
    },
    {
      meterNumber: "GAS-3001",
      status: "ACTIVE",
      utilityType: "GAS",
      unit: "m³",
    },
    {
      meterNumber: "ELC-1002",
      status: "ACTIVE",
      utilityType: "ELECTRICITY",
      unit: "kWh",
    },
  ]);

  const [meterRows] = await connection.query<mysql.RowDataPacket[]>(
    "SELECT id, meter_number FROM meters"
  );
  const meterByNumber = Object.fromEntries(meterRows.map((m) => [m.meter_number, m]));

  console.log("Seeding assignments...");
  await db.insert(meterCustomerAssignments).values([
    {
      meterId: meterByNumber["ELC-1001"].id,
      customerId: customerByEmail["customer@enerlytics.com"].id,
    },
    {
      meterId: meterByNumber["WTR-2001"].id,
      customerId: customerByEmail["customer@enerlytics.com"].id,
    },
    {
      meterId: meterByNumber["GAS-3001"].id,
      customerId: customerByEmail["billing@acme.example"].id,
    },
    {
      meterId: meterByNumber["ELC-1002"].id,
      customerId: customerByEmail["john@example.com"].id,
    },
  ]);

  const period = new Date().toISOString().slice(0, 7);
  await db.insert(meterReaderAssignments).values([
    {
      meterId: meterByNumber["ELC-1001"].id,
      meterReaderId: userByEmail["reader@enerlytics.com"].id,
      period,
      status: "PENDING",
    },
    {
      meterId: meterByNumber["WTR-2001"].id,
      meterReaderId: userByEmail["reader@enerlytics.com"].id,
      period,
      status: "PENDING",
    },
    {
      meterId: meterByNumber["ELC-1002"].id,
      meterReaderId: userByEmail["reader@enerlytics.com"].id,
      period,
      status: "COMPLETED",
    },
  ]);

  console.log("Seeding tariffs...");
  await db.insert(tariffs).values([
    {
      name: "Residential Electricity",
      utilityType: "ELECTRICITY",
      status: "ACTIVE",
      fixedCharge: "300.00",
      ratePerUnit: "25.0000",
    },
    {
      name: "Residential Water",
      utilityType: "WATER",
      status: "ACTIVE",
      fixedCharge: "150.00",
      ratePerUnit: "40.0000",
    },
    {
      name: "Commercial Gas",
      utilityType: "GAS",
      status: "ACTIVE",
      fixedCharge: "200.00",
      ratePerUnit: "55.0000",
    },
  ]);

  const [tariffRows] = await connection.query<mysql.RowDataPacket[]>(
    "SELECT id, utility_type FROM tariffs"
  );
  const tariffByUtility = Object.fromEntries(
    tariffRows.map((t) => [t.utility_type, t])
  );

  await db.insert(tariffSlabs).values([
    {
      tariffId: tariffByUtility.ELECTRICITY.id,
      minUnits: "0.00",
      maxUnits: "30.00",
      ratePerUnit: "12.0000",
      fixedCharge: "0.00",
    },
    {
      tariffId: tariffByUtility.ELECTRICITY.id,
      minUnits: "31.00",
      maxUnits: "60.00",
      ratePerUnit: "25.0000",
      fixedCharge: "0.00",
    },
    {
      tariffId: tariffByUtility.ELECTRICITY.id,
      minUnits: "61.00",
      maxUnits: null,
      ratePerUnit: "42.0000",
      fixedCharge: "0.00",
    },
    {
      tariffId: tariffByUtility.WATER.id,
      minUnits: "0.00",
      maxUnits: "10.00",
      ratePerUnit: "20.0000",
      fixedCharge: "0.00",
    },
    {
      tariffId: tariffByUtility.WATER.id,
      minUnits: "11.00",
      maxUnits: null,
      ratePerUnit: "45.0000",
      fixedCharge: "0.00",
    },
    {
      tariffId: tariffByUtility.GAS.id,
      minUnits: "0.00",
      maxUnits: null,
      ratePerUnit: "55.0000",
      fixedCharge: "0.00",
    },
  ]);

  console.log("Seeding readings, bills, payments, complaints...");
  const today = new Date();

  await db.insert(meterReadings).values([
    {
      meterId: meterByNumber["ELC-1002"].id,
      readingDate: today,
      previousReading: "1000.00",
      currentReading: "1125.00",
      unitsUsed: "125.00",
      billAmount: "0.00",
    },
  ]);

  await db.insert(bills).values([
    {
      meterId: meterByNumber["ELC-1002"].id,
      customerId: customerByEmail["john@example.com"].id,
      previousReading: "1000.00",
      currentReading: "1125.00",
      unitsUsed: "125.00",
      billAmount: "3850.00",
      status: "PARTIALLY PAID",
      createdAt: today,
    },
  ]);

  const [billRows] = await connection.query<mysql.RowDataPacket[]>(
    "SELECT id FROM bills LIMIT 1"
  );
  const billId = billRows[0].id;

  await db.insert(payments).values([
    {
      billId,
      amount: "1500.00",
      paymentMethod: "CASH",
      paymentDate: new Date(),
      referenceNumber: "RCPT-0001",
      notes: "Partial payment",
      recordedBy: userByEmail["cashier@enerlytics.com"].id,
    },
  ]);

  await db.insert(complaints).values([
    {
      customerId: customerByEmail["customer@enerlytics.com"].id,
      subject: "High electricity bill",
      complaintText: "My last bill seems unusually high. Please review the meter reading.",
      status: "PENDING",
    },
  ]);

  console.log("\nSeed complete.\n");
  console.log("Demo logins (password: password123):");
  console.log("  admin@enerlytics.com     ADMIN");
  console.log("  staff@enerlytics.com     ADMIN_STAFF");
  console.log("  reader@enerlytics.com    METER_READER");
  console.log("  cashier@enerlytics.com   CASHIER");
  console.log("  manager@enerlytics.com   MANAGER");
  console.log("  customer@enerlytics.com  CUSTOMER");

  await connection.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
