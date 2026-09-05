import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { db } from "@/lib/db";

// GET /api/vendor/support/tickets - Fetch vendor support tickets from DB
export async function GET(_req: NextRequest) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tickets = await db.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const formatted = tickets.map((t) => ({
      id: t.ticketNumber || t.id,
      dbId: t.id,
      subject: t.subject,
      category: t.category,
      priority: t.priority,
      status: t.status,
      message: t.message,
      lastUpdate: t.updatedAt.toISOString(),
      createdDate: t.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }));

    return NextResponse.json({ tickets: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch support tickets" }, { status: 500 });
  }
}

// POST /api/vendor/support/tickets - Create a new support ticket in DB
export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { subject, category, priority, message } = body;

    if (!subject || !subject.trim()) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message description is required" }, { status: 400 });
    }

    const count = await db.supportTicket.count();
    const ticketNumber = `TKT-${10000 + count + 1}`;

    const ticket = await db.supportTicket.create({
      data: {
        ticketNumber,
        userId,
        subject: subject.trim(),
        category: category || "General",
        priority: priority || "medium",
        status: "open",
        message: message.trim(),
      },
    });

    return NextResponse.json({
      ticket: {
        id: ticket.ticketNumber,
        dbId: ticket.id,
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        message: ticket.message,
        lastUpdate: ticket.updatedAt.toISOString(),
        createdDate: ticket.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create support ticket" }, { status: 500 });
  }
}
