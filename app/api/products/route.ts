import { NextRequest, NextResponse } from "next/server";
import { catalogService } from "@/modules/catalog/service";
import { GetProductsQuerySchema } from "@/modules/catalog/dto";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawQueryParams: Record<string, any> = Object.fromEntries(searchParams.entries());

    // If multiple 'category' parameters exist in the URL string, collect them into an array
    const allCategories = searchParams.getAll("category");
    if (allCategories.length > 1) {
      rawQueryParams.category = allCategories;
    }

    // Validate request query parameters using Zod Schema
    const parseResult = GetProductsQuerySchema.safeParse(rawQueryParams);
    if (!parseResult.success) {
      return NextResponse.json(
        { message: "Invalid query parameters", errors: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    // Delegate to Service Layer
    const result = await catalogService.getProducts(parseResult.data);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
