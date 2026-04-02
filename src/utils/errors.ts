import { Elysia } from "elysia";

/**
 * Standardized error handling middleware.
 * Uses `as unknown` casts since Elysia's error union is wide.
 */
export const errorMiddleware = new Elysia({ name: "ErrorMiddleware" }).onError(
	({ code, error, set }) => {
		const err = error as unknown as Record<string, unknown>;
		const message = (err.message as string) || "An unexpected error occurred";

		console.error(`[API Error] ${code}:`, message);

		const base = { success: false, code, message };

		switch (code) {
			case "VALIDATION":
				set.status = 422;
				return {
					...base,
					error: "Validation Error",
					details: err.all,
				};

			case "NOT_FOUND":
				set.status = 404;
				return { ...base, error: "Not Found" };

			case "INVALID_COOKIE_SIGNATURE":
				set.status = 401;
				return { ...base, error: "Unauthorized" };

			default: {
				const status = (err.status as number) || 500;
				set.status = status;
				return {
					...base,
					error: status === 500 ? "Internal Server Error" : "Error",
				};
			}
		}
	},
);
