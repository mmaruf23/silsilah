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
CREATE TABLE \`tokens\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`user_id\` integer NOT NULL,
	\`expires_at\` integer NOT NULL,
	\`revoked_at\` integer,
	\`replaced_by\` text,
	\`created_at\` integer NOT NULL,
	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
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
  "0001_seed_person_table.sql": `
-- Migration number: 0001 	 2026-02-01T17:15:01.641Z
INSERT INTO
    persons (
        name,
        address,
        gender,
        created_at
    )
VALUES (
        "mastaka",
        "pasirmakam",
        "male",
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        "sapiah",
        "pasirmakam",
        "female",
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        "saprudin",
        "kukulu",
        "male",
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        "safaat",
        "leweungkadu",
        "male",
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        "mulyanah",
        "pasirmakam",
        "female",
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        "surmanah",
        "pasirmakam",
        "female",
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        "salikun",
        "pasirmakam",
        "male",
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    );
`,
  "0002_seed_user_table.sql": `
-- Migration number: 0002 	 2026-02-01T17:15:17.806Z
INSERT INTO
    users (
        username,
        password,
        role,
        created_at
    )
VALUES (
        'iniadmin',
        NULL,
        'admin',
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        'rifasella',
        NULL,
        'admin',
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    );
`,
  "0003_seed_mariage_table.sql": `
-- Migration number: 0003 	 2026-02-01T17:15:24.452Z
INSERT INTO
    mariage (
        husband_id,
        wife_id,
        created_at
    )
VALUES (
        1,
        2,
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    );
`,
  "0004_seed_descendant_table.sql": `
-- Migration number: 0004 	 2026-02-01T17:15:34.066Z
INSERT INTO
    descendant (
        person_id,
        mariage_id,
        created_at
    )
VALUES (
        3,
        1,
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        4,
        1,
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        5,
        1,
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        6,
        1,
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    ),
    (
        7,
        1,
        CAST(
            strftime('%s', 'now') AS INTEGER
        )
    );
`,
} as const;
