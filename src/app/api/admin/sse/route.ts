import { NextRequest } from "next/server";
import { subscribeToRecords, WalletRecord } from "@/lib/db";
import { decryptSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 1. Authorize Connection
    const sessionCookie = req.cookies.get("admin_session")?.value;
    const session = sessionCookie ? await decryptSession(sessionCookie) : null;

    if (!session || !session.authenticated || session.role !== "admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Setup Event Stream
    const encoder = new TextEncoder();
    
    const responseStream = new ReadableStream({
      start(controller) {
        // Send connection initialization message
        controller.enqueue(encoder.encode("data: {\"event\":\"connected\"}\n\n"));

        // Subscribe to record insertions
        const unsubscribe = subscribeToRecords((record: WalletRecord) => {
          try {
            const dataStr = JSON.stringify(record);
            controller.enqueue(encoder.encode(`data: ${dataStr}\n\n`));
          } catch (e) {
            console.error("Error writing event to SSE stream:", e);
          }
        });

        // Set up keep-alive ping every 30 seconds
        const intervalId = setInterval(() => {
          try {
            controller.enqueue(encoder.encode("data: {\"event\":\"ping\"}\n\n"));
          } catch (e) {
            console.error("Error sending SSE heartbeat ping:", e);
          }
        }, 30000);

        // Terminate subscription when stream is closed/aborted
        req.signal.addEventListener("abort", () => {
          clearInterval(intervalId);
          unsubscribe();
        });
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in SSE route handler:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
