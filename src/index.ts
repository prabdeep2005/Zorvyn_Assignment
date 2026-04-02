import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

const app = new Elysia()
	.use(swagger())
	.get("/", () => ({
		message: "Finance API - (Bun + Docker)",
		version: "1.0.0-beta",
	}))
	.get("/status", () => ({
		status: "online",
		runtime: "Bun",
		engine: "ElysiaJS",
	}))
	.listen(3000);

console.log(`Finance Backend is running at http://localhost:3000`);
console.log(`Documentation available at http://localhost:3000/swagger`);

export type App = typeof app;
