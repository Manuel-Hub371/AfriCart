import { catalogService } from "@/modules/catalog/service";
import { ProductDetailView } from "@/components/product/product-detail-view";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  const product = await catalogService.getProductDetails(productId).catch(() => null);

  return <ProductDetailView product={product} />;
}
