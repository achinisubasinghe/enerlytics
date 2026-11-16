import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/rbac";
import { created, badRequest, error, unauthorized, conflict } from "@/lib/api-response";
import bcrypt from "bcryptjs";

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(req: Request) {
  const user = requireRole(req, [ROLES.ADMIN, ROLES.ADMIN_STAFF]);
  if (!user) {
    return unauthorized("Access denied");
  }

  try {
    const { name, email, phone, nic, address, customerType, createLogin } = await req.json();

    if (!name || !email) {
      return badRequest("Name and email are required");
    }

    const [existingCustomer] = await db.query(
      "SELECT id FROM customers WHERE email = ?",
      [email]
    );

    if (existingCustomer.length > 0) {
      return conflict("Customer with this email already exists");
    }

    await db.query(
      "INSERT INTO customers (name, email, phone, nic, address, customer_type) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, phone || null, nic || null, address || null, customerType || "HOUSEHOLD"]
    );

    let generatedPassword: string | null = null;

    if (createLogin) {
      const [existingUser] = await db.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

      if (existingUser.length > 0) {
        return conflict("User account with this email already exists");
      }

      generatedPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      await db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, ROLES.CUSTOMER]
      );
    }

    return created({
      message: "Customer added successfully",
      password: generatedPassword, // Only set if login was created
    });
  } catch (err: unknown) {
    return error((err as Error).message);
  }
}
