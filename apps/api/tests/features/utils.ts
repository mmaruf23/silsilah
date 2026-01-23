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
);`;

export const queryCreateUserTable = `CREATE TABLE users (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	username text NOT NULL UNIQUE,
	password text,
	role text DEFAULT 'user' NOT NULL,
	person_id integer,
	created_at integer NOT NULL,
	updated_at integer,
	FOREIGN KEY (person_id) REFERENCES persons(id) ON UPDATE no action ON DELETE set null
);`;

export const querySeedUserTable = `INSERT INTO users (username, role, created_at) VALUES ('admin', 'admin', 1767445982),('rifasella','user',1767445982);`;

export const querySeedPersonTable = `INSERT INTO persons (name, address, gender, created_at) VALUES ("yukino", "chiba", "female", 1767445982), ("yui", "chiba", "female", 1767445982), ("yumiko", "chiba", "female", 1767445982), ("komachi", "chiba", "female", 1767445982 )`;
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
