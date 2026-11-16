import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/rbac";
import { success, created, badRequest, error, unauthorized } from "@/lib/api-response";

export async function GET(req: Request) {
    const user = requireRole(req, [ROLES.CUSTOMER]);
    if (!user) {
        return unauthorized("Access denied");
    }

    try {
        const [customers] = await db.query(
            "SELECT id FROM customers WHERE email = ?",
            [user.email]
        );

        if (customers.length === 0) {
            return success([]);
        }

        const customerId = customers[0].id;

        const [complaints] = await db.query(
            "SELECT * FROM complaints WHERE customer_id = ? ORDER BY created_at DESC",
            [customerId]
        );

        return success(complaints);
    } catch (err: unknown) {
        return error((err as Error).message);
    }
}

export async function POST(req: Request) {
    const user = requireRole(req, [ROLES.CUSTOMER]);
    if (!user) {
        return unauthorized("Access denied");
    }

    try {
        const { subject, complaint_text } = await req.json();

        if (!subject || !complaint_text) {
            return badRequest("Subject and complaint text are required");
        }

        const [customers] = await db.query(
            "SELECT id FROM customers WHERE email = ?",
            [user.email]
        );

        if (customers.length === 0) {
            return badRequest("Customer not found");
        }

        const customerId = customers[0].id;

        const [result] = await db.query(
            "INSERT INTO complaints (customer_id, subject, complaint_text, status) VALUES (?, ?, ?, 'PENDING')",
            [customerId, subject, complaint_text]
        );

        return created({ message: "Complaint submitted successfully", id: result.insertId });
    } catch (err: unknown) {
        return error((err as Error).message);
    }
}
