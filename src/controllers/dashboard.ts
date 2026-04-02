import { desc, eq, sql } from "drizzle-orm";
import { Elysia } from "elysia";
import { analystGuard } from "../auth/guards.ts";
import { db } from "../db/index.ts";
import { financialRecords, users } from "../db/schema.ts";

export const dashboardController = new Elysia({ prefix: "/dashboard" })
	// GET /dashboard/summary — total income, expenses, net balance
	.get(
		"/summary",
		async () => {
			const [income] = await db
				.select({ total: sql<number>`coalesce(sum(amount::numeric), 0)` })
				.from(financialRecords)
				.where(eq(financialRecords.type, "income"));

			const [expense] = await db
				.select({ total: sql<number>`coalesce(sum(amount::numeric), 0)` })
				.from(financialRecords)
				.where(eq(financialRecords.type, "expense"));

			const totalIncome = Number(income?.total ?? 0);
			const totalExpenses = Number(expense?.total ?? 0);

			return {
				success: true,
				data: {
					totalIncome,
					totalExpenses,
					netBalance: totalIncome - totalExpenses,
				},
			};
		},
		analystGuard,
	)
	// GET /dashboard/categories — category-wise breakdown
	.get(
		"/categories",
		async () => {
			const result = await db
				.select({
					category: financialRecords.category,
					type: financialRecords.type,
					total: sql<number>`sum(amount::numeric)`,
					count: sql<number>`count(*)::int`,
				})
				.from(financialRecords)
				.groupBy(financialRecords.category, financialRecords.type)
				.orderBy(sql`sum(amount::numeric) desc`);

			return { success: true, data: result };
		},
		analystGuard,
	)
	// GET /dashboard/trends?period=monthly|weekly — trend aggregations
	.get(
		"/trends",
		async ({ query }) => {
			const period = query.period === "weekly" ? "week" : "month";

			const result = await db
				.select({
					period: sql<string>`to_char(date_trunc(${period}, date), 'YYYY-MM-DD')`,
					type: financialRecords.type,
					total: sql<number>`sum(amount::numeric)`,
					count: sql<number>`count(*)::int`,
				})
				.from(financialRecords)
				.groupBy(sql`date_trunc(${period}, date)`, financialRecords.type)
				.orderBy(sql`date_trunc(${period}, date) desc`)
				.limit(24); // last 24 periods

			return { success: true, data: result };
		},
		analystGuard,
	)
	// GET /dashboard/recent — recent activity feed
	.get(
		"/recent",
		async () => {
			const result = await db
				.select({
					id: financialRecords.id,
					amount: financialRecords.amount,
					type: financialRecords.type,
					category: financialRecords.category,
					date: financialRecords.date,
					notes: financialRecords.notes,
					userName: users.name,
					userEmail: users.email,
				})
				.from(financialRecords)
				.leftJoin(users, eq(financialRecords.userId, users.id))
				.orderBy(desc(financialRecords.date))
				.limit(10);

			return { success: true, data: result };
		},
		analystGuard,
	);
