import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/rbac";
import { success, error, unauthorized } from "@/lib/api-response";

export async function GET(req: Request) {
    const user = requireRole(req, [ROLES.MANAGER, ROLES.ADMIN]);
    if (!user) {
        return unauthorized("Access denied");
    }

    try {
        const [consumptionByUtility] = await db.query(
            `SELECT 
                m.utility_type,
                SUM(b.units_used) as total_units,
                AVG(b.units_used) as avg_units,
                COUNT(b.id) as reading_count
             FROM bills b
             JOIN meters m ON b.meter_id = m.id
             GROUP BY m.utility_type`
        );

        const [monthlyConsumption] = await db.query(
            `SELECT 
                DATE_FORMAT(b.createdAt, '%Y-%m') as month,
                m.utility_type,
                SUM(b.units_used) as units
             FROM bills b
             JOIN meters m ON b.meter_id = m.id
             WHERE b.createdAt >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
             GROUP BY DATE_FORMAT(b.createdAt, '%Y-%m'), m.utility_type
             ORDER BY month DESC`
        );

        const [topConsumers] = await db.query(
            `SELECT 
                c.name,
                c.email,
                m.utility_type,
                SUM(b.units_used) as total_consumption
             FROM bills b
             JOIN meters m ON b.meter_id = m.id
             JOIN customers c ON b.customer_id = c.id
             GROUP BY c.id, m.utility_type
             ORDER BY total_consumption DESC
             LIMIT 10`
        );

        return success({
            consumptionByUtility,
            monthlyConsumption,
            topConsumers
        });
    } catch (err: unknown) {
        return error((err as Error).message);
    }
}
