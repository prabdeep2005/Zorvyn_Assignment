import {
	decimal,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

// Enums for Enforcing Business Rules
export const userRoleEnum = pgEnum("user_role", ["viewer", "analyst", "admin"]);
export const userStatusEnum = pgEnum("user_status", ["active", "inactive"]);
export const transactionTypeEnum = pgEnum("transaction_type", [
	"income",
	"expense",
]);

// Users Table: Role-based identity management
export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	role: userRoleEnum("role").default("viewer").notNull(),
	status: userStatusEnum("status").default("active").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Financial Records Table: Performance-first data storage
export const financialRecords = pgTable("financial_records", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
	type: transactionTypeEnum("type").notNull(),
	category: text("category").notNull(),
	date: timestamp("date").notNull(),
	notes: text("notes"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type FinancialRecord = typeof financialRecords.$inferSelect;
export type NewFinancialRecord = typeof financialRecords.$inferInsert;
