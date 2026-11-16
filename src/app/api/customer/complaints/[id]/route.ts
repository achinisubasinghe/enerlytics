import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/rbac";
import { success, notFound, error, unauthorized } from "@/lib/api-response";

export async function GET(req: Request, context: { params: Promise<Record<string, string>> }) {
    const user = requireRole(req, [ROLES.CUSTOMER]);
    if (!user) {
        return unauthorized("Access denied");
    }

    try {
        const { id } = await context.params;

        const [customers] = await db.query(
            "SELECT id FROM customers WHERE email = ?",
            [user.email]
        );

        if (customers.length === 0) {
            return notFound("Customer not found");
        }

        const customerId = customers[0].id;

        const [rows] = await db.query(
            "SELECT * FROM complaints WHERE id = ? AND customer_id = ?",
            [id, customerId]
        );

        if (rows.length === 0) {
            return notFound("Complaint not found");
        }

        return success(rows[0]);
    } catch (err: unknown) {
        return error((err as Error).message);
    }
}

export async function PUT(req: Request, context: { params: Promise<Record<string, string>> }) {
    try {
        const { id } = await context.params;
        const { user_id, complaint_text } = await req.json();

        const [result] = await db.query(
            "UPDATE complaints SET user_id=?, complaint_text=? WHERE id=?",
            [user_id, complaint_text, id]
        );

        if (result.affectedRows === 0) {
            return notFound("Complaint not found");
        }

        return success({ message: "Complaint updated successfully" });
    } catch (err: unknown) {
        return error((err as Error).message);
    }
}

export async function DELETE(req: Request, context: { params: Promise<Record<string, string>> }) {
    try {
        const { id } = await context.params;
        const [result] = await db.query("DELETE FROM complaints WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return notFound("Complaint not found");
        }

        return success({ message: "Complaint deleted successfully" });
    } catch (err: unknown) {
        return error((err as Error).message);
    }
}
