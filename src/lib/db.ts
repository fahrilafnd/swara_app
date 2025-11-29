import mysql, { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";

let pool: Pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("✅ MySQL pool created");
  }
  return pool;
}

export async function query<T extends RowDataPacket[] | any[]>(
  sql: string,
  params?: any[]
): Promise<T> {
  const [rows] = await getPool().query<T>(sql, params);
  return rows;
}

export async function run(
  sql: string,
  params?: any[]
): Promise<ResultSetHeader> {
  const [result] = await getPool().execute<ResultSetHeader>(sql, params);
  return result;
}

export async function queryOne<T extends RowDataPacket>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T[]>(sql, params);
  return rows[0] || null;
}

export default getPool;