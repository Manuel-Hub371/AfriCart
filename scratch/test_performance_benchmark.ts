import { db } from "../lib/db";
import { GET } from "../app/api/deals/route";

async function benchmarkDealsApi() {
  console.log("=== BENCHMARKING GET /api/deals COLD VS HOT LATENCY ===");

  // Cold Start (Prisma DB Connection Handshake)
  const start1 = performance.now();
  const mockReq1 = new Request("http://localhost:3000/api/deals?limit=24");
  const res1 = await GET(mockReq1 as any);
  await res1.json();
  const duration1 = performance.now() - start1;
  console.log(`Cold-Start Request: ${duration1.toFixed(2)} ms`);

  // Hot Request (Warm Connection & Cached Timestamps)
  const start2 = performance.now();
  const mockReq2 = new Request("http://localhost:3000/api/deals?limit=24");
  const res2 = await GET(mockReq2 as any);
  const data2 = await res2.json();
  const duration2 = performance.now() - start2;

  console.log(`Hot Request Latency: ${duration2.toFixed(2)} ms`);
  console.log(`Products Returned: ${data2.products?.length}`);

  await db.$disconnect();
}

benchmarkDealsApi();
