import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";

// GET /api/products/[id]/questions - Fetch questions for a product
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const questions = await db.productQuestion.findMany({
      where: { productId: id },
      orderBy: { createdAt: "desc" },
    });

    const formatted = questions.map((q) => ({
      id: q.id,
      customerName: q.customerName,
      question: q.question,
      answer: q.answer || null,
      answeredAt: q.answeredAt ? q.answeredAt.toISOString() : null,
      helpfulVotes: q.helpfulVotes,
      createdAt: q.createdAt.toISOString(),
    }));

    return NextResponse.json({ questions: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch questions" }, { status: 500 });
  }
}

// POST /api/products/[id]/questions - Submit a new question
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { question, customerName } = body;

    if (!question || !question.trim()) {
      return NextResponse.json({ error: "Question content is required" }, { status: 400 });
    }

    const userId = await getAuthenticatedUserId();
    let name = customerName || "Customer";

    if (userId) {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true },
      });
      if (user) {
        name = `${user.firstName} ${user.lastName}`;
      }
    }

    const newQuestion = await db.productQuestion.create({
      data: {
        productId: id,
        customerName: name,
        question: question.trim(),
      },
    });

    return NextResponse.json({
      question: {
        id: newQuestion.id,
        customerName: newQuestion.customerName,
        question: newQuestion.question,
        answer: null,
        answeredAt: null,
        helpfulVotes: 0,
        createdAt: newQuestion.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit question" }, { status: 500 });
  }
}
