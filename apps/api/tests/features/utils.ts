import { sign } from 'hono/jwt';

export const queryCreatePersonTable = `CREATE TABLE persons (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	name text NOT NULL,
	fullname text,
	address text NOT NULL,
	gender text NOT NULL,
	birth_date integer,
	death_date integer,
	created_at integer NOT NULL,
	updated_at integer
);
CREATE UNIQUE INDEX name_address_unique_constraint ON persons (name,fullname,address);
`;

export const queryCreateUserTable = `CREATE TABLE users (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	username text NOT NULL UNIQUE,
	password text,
	role text DEFAULT 'user' NOT NULL,
	person_id integer,
	created_at integer NOT NULL,
	updated_at integer,
	FOREIGN KEY (person_id) REFERENCES persons(id) ON UPDATE no action ON DELETE set null
);
CREATE UNIQUE INDEX users_username_unique ON users (username);`;

export const queryCreateMariageTable = `CREATE TABLE mariage (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	husband_id integer,
	wife_id integer,
	start_date text,
	end_date text,
	created_at integer NOT NULL,
	updated_at integer,
	FOREIGN KEY (husband_id) REFERENCES persons(id) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (wife_id) REFERENCES persons(id) ON UPDATE no action ON DELETE set null
);
CREATE UNIQUE INDEX husband_wife_unique_constraint ON mariage (husband_id,wife_id);`;

export const queryCreateDescendantTable = `CREATE TABLE descendant (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	user_id integer NOT NULL,
	mariage_id integer NOT NULL,
	created_at integer NOT NULL,
	updated_at integer,
	FOREIGN KEY (user_id) REFERENCES persons(id) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (mariage_id) REFERENCES mariage(id) ON UPDATE no action ON DELETE cascade
);`;

export const querySeedUserTable = `INSERT INTO users (username, role, created_at) VALUES ('admin', 'admin', 1767445982),('rifasella','user',1767445982);`;
export const querySeedPersonTable = `INSERT INTO persons (name, address, gender, created_at) VALUES ("hachiman", "chiba", "male", 1767445982), ("yukino", "chiba", "female", 1767445982), ("yui", "chiba", "female", 1767445982), ("yumiko", "chiba", "female", 1767445982), ("komachi", "chiba", "female", 1767445982 )`;
export const querySeedMariageTable = `INSERT INTO mariage (husband_id, wife_id, created_at) VALUES (1, 2, 1767445982)`;
export const querySeedDescendantTable = `INSERT INTO descendant (persons_id, mariage_id, created_at) VALUES (3, 4, 1767445982)`; // komachi jadi anak

/**
 *
 * @param JWT_SECRET
 * @param admin default false
 * @returns promised string token
 */
export const generateToken = (JWT_SECRET: string, admin: boolean = false) =>
  sign(
    {
      sub: 'generated',
      role: admin ? 'admin' : 'user',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 jam
    },
    JWT_SECRET,
  );

// next : update type start_date sama end_date mariage jadi tipe integer-date. biar bisa dipake ngitung usia pernikahan.
