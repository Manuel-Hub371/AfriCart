import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { shoppingService } from "@/modules/shopping/service";
import { AddressSchema } from "@/modules/shopping/dto";

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const addresses = await shoppingService.getAddresses(userId);
    return NextResponse.json(addresses);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch addresses" },
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
    const parseResult = AddressSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ message: parseResult.error }, { status: 400 });
    }

    const addresses = await shoppingService.createAddress(userId, parseResult.data);
    return NextResponse.json(addresses);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create address" },
      { status: 500 }
    );
  }
}
