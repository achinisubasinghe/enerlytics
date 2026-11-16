import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/rbac";
import { success, error, unauthorized } from "@/lib/api-response";

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

        const [meters] = await db.query(
            `SELECT m.*, mca.assigned_at 
             FROM meters m
             JOIN meter_customer_assignments mca ON m.id = mca.meter_id
             WHERE mca.customer_id = ? AND mca.unassigned_at IS NULL
             ORDER BY mca.assigned_at DESC`,
            [customerId]
        );

        return success(meters);
    } catch (err: unknown) {
        return error((err as Error).message);
    }
}
