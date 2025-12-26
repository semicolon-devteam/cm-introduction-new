/**
 * SEMO Database Connection Utility
 *
 * PostgreSQL 연결 (팀 중앙 DB)
 * - Host: SEMO_DB_HOST (default: 3.38.162.21)
 * - Database: SEMO_DB_NAME (default: appdb)
 * - Schema: semo
 */

import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";

// Singleton pool instance
let pool: Pool | null = null;

/**
 * SEMO DB 연결 풀 가져오기
 */
export function getSemoDbPool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.SEMO_DB_HOST || "3.38.162.21",
      port: parseInt(process.env.SEMO_DB_PORT || "5432", 10),
      database: process.env.SEMO_DB_NAME || "appdb",
      user: process.env.SEMO_DB_USER || "app",
      password: process.env.SEMO_DB_PASSWORD,
      ssl: false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    // Connection error handler
    pool.on("error", (err) => {
      console.error("[SEMO DB] Unexpected error on idle client", err);
    });
  }

  return pool;
}

/**
 * SEMO DB 쿼리 실행
 */
export async function querySemoDb<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const pool = getSemoDbPool();
  const start = Date.now();

  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;

    if (process.env.NODE_ENV === "development") {
      console.log("[SEMO DB] Query executed", {
        text: text.substring(0, 100),
        duration: `${duration}ms`,
        rows: result.rowCount,
      });
    }

    return result;
  } catch (error) {
    console.error("[SEMO DB] Query error", { text, error });
    throw error;
  }
}

/**
 * SEMO DB 트랜잭션 실행
 */
export async function withSemoDbTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const pool = getSemoDbPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * SEMO DB 연결 해제 (앱 종료 시)
 */
export async function closeSemoDbPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
