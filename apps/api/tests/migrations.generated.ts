// AUTO-GENERATED — DO NOT EDIT
export const migrations = {
  "0000_create_tables.sql": `
CREATE TABLE \`descendant\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`person_id\` integer NOT NULL,
	\`mariage_id\` integer NOT NULL,
	\`created_at\` integer NOT NULL,
	\`updated_at\` integer,
	FOREIGN KEY (\`person_id\`) REFERENCES \`persons\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`mariage_id\`) REFERENCES \`mariage\`(\`id\`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE \`mariage\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`husband_id\` integer,
	\`wife_id\` integer,
	\`start_date\` text,
	\`end_date\` text,
	\`created_at\` integer NOT NULL,
	\`updated_at\` integer,
	FOREIGN KEY (\`husband_id\`) REFERENCES \`persons\`(\`id\`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (\`wife_id\`) REFERENCES \`persons\`(\`id\`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX \`husband_wife_unique_constraint\` ON \`mariage\` (\`husband_id\`,\`wife_id\`);--> statement-breakpoint
CREATE TABLE \`persons\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`name\` text NOT NULL,
	\`fullname\` text,
	\`address\` text NOT NULL,
	\`gender\` text NOT NULL,
	\`birth_date\` integer,
	\`death_date\` integer,
	\`created_at\` integer NOT NULL,
	\`updated_at\` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX \`name_address_unique_constraint\` ON \`persons\` (\`name\`,\`fullname\`,\`address\`);--> statement-breakpoint
CREATE TABLE \`users\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`username\` text NOT NULL,
	\`password\` text,
	\`role\` text DEFAULT 'user' NOT NULL,
	\`person_id\` integer,
	\`created_at\` integer NOT NULL,
	\`updated_at\` integer,
	FOREIGN KEY (\`person_id\`) REFERENCES \`persons\`(\`id\`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX \`users_username_unique\` ON \`users\` (\`username\`);
`,
} as const;
