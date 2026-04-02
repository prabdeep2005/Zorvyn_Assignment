import type { Context } from "elysia";

export const roleGuard = (allowedRoles: string[]) => {
	return {
		beforeHandle: ({ set, headers }: Pick<Context, "set" | "headers">) => {
			const role = headers["x-user-role"];

			if (!role) {
				set.status = 401;
				return { error: "Authentication required" };
			}

			if (!allowedRoles.includes(role)) {
				set.status = 403;
				return { error: "Forbidden: Insufficient permissions" };
			}
		},
	};
};

export const adminGuard = roleGuard(["admin"]);
export const analystGuard = roleGuard(["admin", "analyst"]);
export const viewerGuard = roleGuard(["admin", "analyst", "viewer"]);
