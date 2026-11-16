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
        const [[totalRevenue]] = await db.query(
            `SELECT COALESCE(SUM(amount), 0) as total 
             FROM payments`
        );

        const [monthlyRevenue] = await db.query(
            `SELECT 
                DATE_FORMAT(payment_date, '%Y-%m') as month,
                SUM(amount) as revenue
             FROM payments
             WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
             GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
             ORDER BY month DESC`
        );

        const [revenueByUtility] = await db.query(
            `SELECT 
                m.utility_type,
                SUM(p.amount) as revenue,
                COUNT(DISTINCT p.bill_id) as bill_count
             FROM payments p
             JOIN bills b ON p.bill_id = b.id
             JOIN meters m ON b.meter_id = m.id
             GROUP BY m.utility_type`
        );

        const [[outstandingRevenue]] = await db.query(
            `SELECT 
                COALESCE(SUM(b.bill_amount - COALESCE(total_paid, 0)), 0) as outstanding
             FROM bills b
             LEFT JOIN (
                 SELECT bill_id, SUM(amount) as total_paid
                 FROM payments
                 GROUP BY bill_id
             ) p ON b.id = p.bill_id
             WHERE b.status IN ('NOT PAID', 'PARTIALLY PAID')`
        );

        return success({
            totalRevenue: parseFloat(totalRevenue.total),
            monthlyRevenue,
            revenueByUtility,
            outstandingRevenue: parseFloat(outstandingRevenue.outstanding)
        });
    } catch (err: unknown) {
        return error((err as Error).message);
    }
}
