import { and, desc, eq, gte, ilike, lte, sql } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { adminGuard, viewerGuard } from "../auth/guards.ts";
import { db } from "../db/index.ts";
import { financialRecords } from "../db/schema.ts";

export const recordController = new Elysia({ prefix: "/records" })
	// GET /records — list with optional filters + pagination
	.get(
		"/",
		async ({ query }) => {
			const page = Number(query.page ?? 1);
			const limit = Number(query.limit ?? 20);
			const offset = (page - 1) * limit;

			const conditions: ReturnType<typeof eq>[] = [];

			if (query.type)
				conditions.push(
					eq(financialRecords.type, query.type as "income" | "expense"),
				);
			if (query.category)
				conditions.push(
					ilike(financialRecords.category, `%${query.category}%`),
				);
			if (query.userId)
				conditions.push(eq(financialRecords.userId, query.userId));
			if (query.dateFrom)
				conditions.push(gte(financialRecords.date, new Date(query.dateFrom)));
			if (query.dateTo)
				conditions.push(lte(financialRecords.date, new Date(query.dateTo)));

			const result = await db
				.select()
				.from(financialRecords)
				.where(conditions.length ? and(...conditions) : undefined)
				.orderBy(desc(financialRecords.date))
				.limit(limit)
				.offset(offset);

			const countResult = await db
				.select({ count: sql<number>`count(*)::int` })
				.from(financialRecords)
				.where(conditions.length ? and(...conditions) : undefined);

			const count = countResult[0]?.count ?? 0;

			return {
				success: true,
				data: result,
				meta: { page, limit, total: count, pages: Math.ceil(count / limit) },
			};
		},
		{
			...viewerGuard,
			query: t.Object({
				page: t.Optional(t.String()),
				limit: t.Optional(t.String()),
				type: t.Optional(t.Union([t.Literal("income"), t.Literal("expense")])),
				category: t.Optional(t.String()),
				userId: t.Optional(t.String()),
				dateFrom: t.Optional(t.String()),
				dateTo: t.Optional(t.String()),
			}),
		},
	)
	// GET /records/:id — get single record
	.get(
		"/:id",
		async ({ params, set }) => {
			const [record] = await db
				.select()
				.from(financialRecords)
				.where(eq(financialRecords.id, params.id));

			if (!record) {
				set.status = 404;
				return { success: false, error: "Record not found" };
			}
			return { success: true, data: record };
		},
		{
			...viewerGuard,
			params: t.Object({ id: t.String() }),
		},
	)
	// POST /records — create a record (admin only)
	.post(
		"/",
		async ({ body }) => {
			const [record] = await db
				.insert(financialRecords)
				.values({
					userId: body.userId,
					amount: body.amount.toString(),
					type: body.type,
					category: body.category,
					date: new Date(body.date),
					notes: body.notes,
				})
				.returning();

			return {
				success: true,
				message: "Record created successfully",
				data: record,
			};
		},
		{
			...adminGuard,
			body: t.Object({
				userId: t.String(),
				amount: t.Number({ minimum: 0.01 }),
				type: t.Union([t.Literal("income"), t.Literal("expense")]),
				category: t.String({ minLength: 1 }),
				date: t.String(),
				notes: t.Optional(t.String()),
			}),
		},
	)
	// PATCH /records/:id — update a record (admin only)
	.patch(
		"/:id",
		async ({ params, body, set }) => {
			const updateData: Partial<{
				amount: string;
				type: "income" | "expense";
				category: string;
				date: Date;
				notes: string | null;
			}> = {};
			if (body.amount !== undefined) updateData.amount = body.amount.toString();
			if (body.type) updateData.type = body.type;
			if (body.category) updateData.category = body.category;
			if (body.date) updateData.date = new Date(body.date);
			if (body.notes !== undefined) updateData.notes = body.notes;

			const [updated] = await db
				.update(financialRecords)
				.set(updateData)
				.where(eq(financialRecords.id, params.id))
				.returning();

			if (!updated) {
				set.status = 404;
				return { success: false, error: "Record not found" };
			}
			return {
				success: true,
				message: "Record updated successfully",
				data: updated,
			};
		},
		{
			...adminGuard,
			params: t.Object({ id: t.String() }),
			body: t.Object({
				amount: t.Optional(t.Number({ minimum: 0.01 })),
				type: t.Optional(t.Union([t.Literal("income"), t.Literal("expense")])),
				category: t.Optional(t.String()),
				date: t.Optional(t.String()),
				notes: t.Optional(t.String()),
			}),
		},
	)
	// DELETE /records/:id — delete a record (admin only)
	.delete(
		"/:id",
		async ({ params, set }) => {
			const [deleted] = await db
				.delete(financialRecords)
				.where(eq(financialRecords.id, params.id))
				.returning();

			if (!deleted) {
				set.status = 404;
				return { success: false, error: "Record not found" };
			}
			return { success: true, message: "Record deleted successfully" };
		},
		{
			...adminGuard,
			params: t.Object({ id: t.String() }),
		},
	);
