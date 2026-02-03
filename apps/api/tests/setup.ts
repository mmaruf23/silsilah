// FILE DIJALANKAN DENGEN TSX UNTUK GENERATE FILE MIGRATION DARI SQL SCHEMA UNTUK KEPERLUAN TESTING
import fs from 'node:fs/promises';
import path from 'node:path';

const MIGRATIONS_DIR = path.resolve(__dirname, '..', 'drizzle', 'migration');
const OUTPUT_FILE = path.resolve(__dirname, 'migrations.generated.ts');

const escapeBackticks = (sql: string) => sql.replace(/`/g, '\\`');

const run = async () => {
  const files = (await fs.readdir(MIGRATIONS_DIR))
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const entries: string[] = [];

  for (const file of files) {
    const fullPath = path.join(MIGRATIONS_DIR, file);
    const raw = await fs.readFile(fullPath, 'utf8');

    const escaped = escapeBackticks(raw);

    entries.push(`  "${file}": \`\n${escaped}\n\`,`);
  }

  const output = `// AUTO-GENERATED — DO NOT EDIT
export const migrations = {
${entries.join('\n')}
} as const;
`;

  await fs.writeFile(OUTPUT_FILE, output);
  console.log(`✔ migrations generated (${files.length} files)`);
};

run().catch(console.error);
