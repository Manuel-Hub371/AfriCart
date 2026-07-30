import { NextResponse } from "next/server";
import { catalogService } from "@/modules/catalog/service";

export async function GET() {
  try {
    const categories = await catalogService.getCategories();
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
