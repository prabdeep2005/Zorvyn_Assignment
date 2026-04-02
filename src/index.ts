import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { dashboardController } from "./controllers/dashboard.ts";
import { recordController } from "./controllers/records.ts";
import { userController } from "./controllers/user.ts";
import { db } from "./db/index.ts";
import { errorMiddleware } from "./utils/errors.ts";

const app = new Elysia()
	.use(errorMiddleware)
	.use(
		swagger({
			documentation: {
				info: {
					title: "Finance Backend API",
					description:
						"High-performance finance management API — Bun + ElysiaJS + Drizzle + Postgres",
					version: "1.0.0",
				},
				tags: [
					{ name: "System", description: "Health & status endpoints" },
					{ name: "Users", description: "User management (RBAC)" },
					{ name: "Records", description: "Financial record CRUD" },
					{ name: "Dashboard", description: "Analytics & aggregations" },
				],
			},
		}),
	)
	// System routes
	.get(
		"/",
		() => ({
			message: "Finance API — Bun + ElysiaJS + Drizzle",
			version: "1.0.0",
			docs: "/swagger",
		}),
		{ tags: ["System"] },
	)
	.get(
		"/status",
		async () => {
			try {
				await db.execute("SELECT 1");
				return {
					status: "online",
					runtime: "Bun",
					engine: "ElysiaJS",
					database: "Postgres (Connected)",
				};
			} catch {
				return {
					status: "degraded",
					runtime: "Bun",
					engine: "ElysiaJS",
					database: "Postgres (Disconnected)",
				};
			}
		},
		{ tags: ["System"] },
	)
	// Feature controllers
	.use(userController)
	.use(recordController)
	.use(dashboardController)
	.listen(3000);

console.log("Finance Backend running at http://localhost:3000");
console.log("Swagger docs at http://localhost:3000/swagger");

export { app };
export type App = typeof app;
