import { getProductDetails } from "@/lib/data/catalog";
import { ProductDetailView } from "@/components/product/product-detail-view";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  const product = await getProductDetails(productId);

  return <ProductDetailView product={product} />;
}
