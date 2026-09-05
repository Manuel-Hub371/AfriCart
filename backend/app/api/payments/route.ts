import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { shoppingService } from "@/modules/shopping/service";
import { PaymentMethodSchema } from "@/modules/shopping/dto";

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const pms = await shoppingService.getPaymentMethods(userId);
    return NextResponse.json(pms);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch payment methods" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parseResult = PaymentMethodSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ message: parseResult.error }, { status: 400 });
    }

    const pms = await shoppingService.createPaymentMethod(userId, parseResult.data);
    return NextResponse.json(pms);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create payment method" },
      { status: 500 }
    );
  }
}
