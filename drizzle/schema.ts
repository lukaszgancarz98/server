import { pgTable, varchar, numeric, unique, serial, text, timestamp, date, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const productType = pgTable("productType", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	price: numeric().notNull(),
	size: varchar({ length: 20 }),
	color: varchar({ length: 255 }),
	shortDescription: varchar().notNull(),
	sizePlaceHolder: varchar(),
	stockQuantity: numeric("stock_quantity").notNull(),
	productId: varchar().notNull(),
	images: varchar().array(),
});

export const products = pgTable("products", {
	id: varchar().default(gen_random_uuid()).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 999 }).notNull(),
	image: varchar({ length: 255 }).notNull(),
	type: varchar().notNull(),
	page: varchar({ length: 255 }),
});

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: text().notNull(),
	name: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	surname: varchar({ length: 255 }),
	type: varchar({ length: 255 }),
}, (table) => [
	unique("users_email_key").on(table.email),
]);

export const orders = pgTable("orders", {
	price: numeric().notNull(),
	email: varchar(),
	createDate: date().default(sql`CURRENT_TIMESTAMP`).notNull(),
	finalizeDate: date(),
	paymentDate: date(),
	status: varchar({ length: 255 }).notNull(),
	id: uuid().defaultRandom().primaryKey().notNull(),
	products: varchar().array().notNull(),
	orderDetails: varchar({ length: 999 }),
});
