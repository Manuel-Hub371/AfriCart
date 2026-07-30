import { NextRequest, NextResponse } from "next/server";
import { catalogService } from "@/modules/catalog/service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await catalogService.getProductDetails(id);
    return NextResponse.json(product);
  } catch (error: any) {
    const status = error.message === "Product not found" ? 404 : 500;
    return NextResponse.json(
      { message: error.message || "Failed to fetch product details" },
      { status }
    );
  }
}
