import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";
import path from "path";

const host = process.env.DB_HOST || "localhost";
const user = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME || "utility_management_system";

async function main() {
  const root = await mysql.createConnection({ host, user, password });
  await root.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
  await root.end();

  const connection = await mysql.createConnection({
    host,
    user,
    password,
    database,
    multipleStatements: true,
  });

  const db = drizzle(connection);
  const migrationsFolder = path.join(process.cwd(), "drizzle");

  console.log(`Migrating database "${database}"...`);
  await migrate(db, { migrationsFolder });
  console.log("Migrations complete.");

  await connection.end();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
