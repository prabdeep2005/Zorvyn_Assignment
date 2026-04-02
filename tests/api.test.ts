import { afterAll, beforeAll, describe, expect, it } from "bun:test";

const BASE = "http://localhost:3000";

type ApiResult = {
	status: number;
	json: {
		success?: boolean;
		data?: unknown;
		meta?: unknown;
		error?: string;
		message?: string;
		version?: string;
		runtime?: string;
		code?: string;
	};
};

async function api(
	path: string,
	opts: { method?: string; role?: string; body?: unknown } = {},
): Promise<ApiResult> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};
	if (opts.role) headers["x-user-role"] = opts.role;

	const res = await fetch(`${BASE}${path}`, {
		method: opts.method ?? "GET",
		headers,
		body: opts.body ? JSON.stringify(opts.body) : undefined,
	});

	const json = (await res.json()) as ApiResult["json"];
	return { status: res.status, json };
}

// ---

describe("System Endpoints", () => {
	it("GET / returns API info", async () => {
		const { status, json } = await api("/");
		expect(status).toBe(200);
		expect(json.version).toBe("1.0.0");
	});

	it("GET /status returns runtime info", async () => {
		const { status, json } = await api("/status");
		expect(status).toBe(200);
		expect(json.runtime).toBe("Bun");
	});
});

describe("RBAC Guards", () => {
	it("GET /users without role returns 401", async () => {
		const { status } = await api("/users");
		expect(status).toBe(401);
	});

	it("GET /users with viewer role returns 403", async () => {
		const { status } = await api("/users", { role: "viewer" });
		expect(status).toBe(403);
	});

	it("GET /users with admin role returns 200", async () => {
		const { status, json } = await api("/users", { role: "admin" });
		expect(status).toBe(200);
		expect(json.success).toBe(true);
	});
});

describe("User Management", () => {
	let userId: string;

	it("POST /users creates a user", async () => {
		const { status, json } = await api("/users", {
			method: "POST",
			role: "admin",
			body: {
				name: "Test User",
				email: `test_${Date.now()}@example.com`,
				role: "analyst",
			},
		});
		expect(status).toBe(200);
		expect(json.success).toBe(true);
		userId = (json.data as Record<string, string>).id ?? "";
	});

	it("GET /users/:id returns the created user", async () => {
		if (!userId) return;
		const { status, json } = await api(`/users/${userId}`, { role: "admin" });
		expect(status).toBe(200);
		expect((json.data as Record<string, string>).id).toBe(userId);
	});

	it("PATCH /users/:id updates user status", async () => {
		if (!userId) return;
		const { status, json } = await api(`/users/${userId}`, {
			method: "PATCH",
			role: "admin",
			body: { status: "inactive" },
		});
		expect(status).toBe(200);
		expect((json.data as Record<string, string>).status).toBe("inactive");
	});

	it("DELETE /users/:id deletes the user", async () => {
		if (!userId) return;
		const { status, json } = await api(`/users/${userId}`, {
			method: "DELETE",
			role: "admin",
		});
		expect(status).toBe(200);
		expect(json.success).toBe(true);
	});
});

describe("Financial Records", () => {
	let recordId: string;
	let ownerId: string;

	beforeAll(async () => {
		const { json } = await api("/users", {
			method: "POST",
			role: "admin",
			body: {
				name: "Record Owner",
				email: `owner_${Date.now()}@example.com`,
				role: "viewer",
			},
		});
		ownerId = (json.data as Record<string, string>).id ?? "";
	});

	afterAll(async () => {
		if (ownerId) {
			await api(`/users/${ownerId}`, { method: "DELETE", role: "admin" });
		}
	});

	it("POST /records creates a financial record", async () => {
		const { status, json } = await api("/records", {
			method: "POST",
			role: "admin",
			body: {
				userId: ownerId,
				amount: 1500.5,
				type: "income",
				category: "Salary",
				date: new Date().toISOString(),
				notes: "Monthly salary",
			},
		});
		expect(status).toBe(200);
		expect(json.success).toBe(true);
		recordId = (json.data as Record<string, string>).id ?? "";
	});

	it("GET /records returns paginated list", async () => {
		const { status, json } = await api("/records?page=1&limit=10", {
			role: "viewer",
		});
		expect(status).toBe(200);
		expect(json.meta).toBeDefined();
		expect(Array.isArray(json.data)).toBe(true);
	});

	it("GET /records?type=income filters by type", async () => {
		const { json } = await api("/records?type=income", { role: "viewer" });
		const data = json.data as Array<{ type: string }>;
		expect(data.every((r) => r.type === "income")).toBe(true);
	});

	it("DELETE /records/:id deletes the record", async () => {
		if (!recordId) return;
		const { status, json } = await api(`/records/${recordId}`, {
			method: "DELETE",
			role: "admin",
		});
		expect(status).toBe(200);
		expect(json.success).toBe(true);
	});
});

describe("Dashboard Analytics", () => {
	it("GET /dashboard/summary returns totals", async () => {
		const { status, json } = await api("/dashboard/summary", {
			role: "analyst",
		});
		const data = json.data as Record<string, number>;
		expect(status).toBe(200);
		expect(data).toHaveProperty("totalIncome");
		expect(data).toHaveProperty("totalExpenses");
		expect(data).toHaveProperty("netBalance");
	});

	it("GET /dashboard/categories returns breakdown", async () => {
		const { status, json } = await api("/dashboard/categories", {
			role: "analyst",
		});
		expect(status).toBe(200);
		expect(Array.isArray(json.data)).toBe(true);
	});

	it("GET /dashboard/trends?period=monthly returns trends", async () => {
		const { status, json } = await api("/dashboard/trends?period=monthly", {
			role: "analyst",
		});
		expect(status).toBe(200);
		expect(Array.isArray(json.data)).toBe(true);
	});

	it("GET /dashboard/recent returns activity feed", async () => {
		const { status, json } = await api("/dashboard/recent", {
			role: "analyst",
		});
		expect(status).toBe(200);
		expect(Array.isArray(json.data)).toBe(true);
	});

	it("GET /dashboard/summary is blocked for viewer", async () => {
		const { status } = await api("/dashboard/summary", { role: "viewer" });
		expect(status).toBe(403);
	});
});
