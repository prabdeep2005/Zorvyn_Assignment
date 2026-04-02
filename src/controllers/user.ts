import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { adminGuard, analystGuard } from "../auth/guards.ts";
import { db } from "../db/index.ts";
import { users } from "../db/schema.ts";

export const userController = new Elysia({ prefix: "/users" })
	// GET /users — list all users (admin & analyst)
	.get(
		"/",
		async () => {
			const result = await db.select().from(users);
			return { success: true, data: result };
		},
		analystGuard,
	)
	// GET /users/:id — get single user (admin & analyst)
	.get(
		"/:id",
		async ({ params, set }) => {
			const [user] = await db
				.select()
				.from(users)
				.where(eq(users.id, params.id));

			if (!user) {
				set.status = 404;
				return { success: false, error: "User not found" };
			}
			return { success: true, data: user };
		},
		{
			...analystGuard,
			params: t.Object({ id: t.String() }),
		},
	)
	// POST /users — create a user (admin only)
	.post(
		"/",
		async ({ body }) => {
			const [newUser] = await db
				.insert(users)
				.values({
					name: body.name,
					email: body.email,
					role: body.role ?? "viewer",
				})
				.returning();

			return {
				success: true,
				message: "User created successfully",
				data: newUser,
			};
		},
		{
			...adminGuard,
			body: t.Object({
				name: t.String({ minLength: 2 }),
				email: t.String({ format: "email" }),
				role: t.Optional(
					t.Union([
						t.Literal("viewer"),
						t.Literal("analyst"),
						t.Literal("admin"),
					]),
				),
			}),
		},
	)
	// PATCH /users/:id — update role or status (admin only)
	.patch(
		"/:id",
		async ({ params, body, set }) => {
			const [updated] = await db
				.update(users)
				.set({
					...(body.role && { role: body.role }),
					...(body.status && { status: body.status }),
					updatedAt: new Date(),
				})
				.where(eq(users.id, params.id))
				.returning();

			if (!updated) {
				set.status = 404;
				return { success: false, error: "User not found" };
			}
			return {
				success: true,
				message: "User updated successfully",
				data: updated,
			};
		},
		{
			...adminGuard,
			params: t.Object({ id: t.String() }),
			body: t.Object({
				role: t.Optional(
					t.Union([
						t.Literal("viewer"),
						t.Literal("analyst"),
						t.Literal("admin"),
					]),
				),
				status: t.Optional(
					t.Union([t.Literal("active"), t.Literal("inactive")]),
				),
			}),
		},
	)
	// DELETE /users/:id — remove user (admin only)
	.delete(
		"/:id",
		async ({ params, set }) => {
			const [deleted] = await db
				.delete(users)
				.where(eq(users.id, params.id))
				.returning();

			if (!deleted) {
				set.status = 404;
				return { success: false, error: "User not found" };
			}
			return { success: true, message: "User deleted successfully" };
		},
		{
			...adminGuard,
			params: t.Object({ id: t.String() }),
		},
	);
