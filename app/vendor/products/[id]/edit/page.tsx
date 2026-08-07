"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import ProductBasicInfo from "@/components/vendor/product/product-basic-info";
import MediaUploader from "@/components/vendor/product/media-uploader";
import CategorySelector from "@/components/vendor/product/category-selector";
import PricingCard from "@/components/vendor/product/pricing-card";
import InventoryCard from "@/components/vendor/product/inventory-card";
import VariantManager, { GeneratedVariant } from "@/components/vendor/product/variant-manager";
import ShippingCard, { ShippingPolicyOption } from "@/components/vendor/product/shipping-card";
import PoliciesCard from "@/components/vendor/product/policies-card";
import MarketingCard, { CampaignOption } from "@/components/vendor/product/marketing-card";
import SeoCard from "@/components/vendor/product/seo-card";
import PublishPanel from "@/components/vendor/product/publish-panel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Basic Information");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [productData, setProductData] = useState({
    name: "",
    brand: "",
    description: "",
    category: "",
    price: 0,
    compareAtPrice: 0,
    stock: 0,
    status: "ACTIVE",
  });
  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<GeneratedVariant[]>([]);
  const [availablePolicies, setAvailablePolicies] = useState<ShippingPolicyOption[]>([]);
  const [selectedPolicyIds, setSelectedPolicyIds] = useState<string[]>([]);

  // Policies state
  const [refundPolicies, setRefundPolicies] = useState<any[]>([]);
  const [returnPolicies, setReturnPolicies] = useState<any[]>([]);
  const [warrantyPolicies, setWarrantyPolicies] = useState<any[]>([]);

  const [selectedRefundPolicyId, setSelectedRefundPolicyId] = useState<string | null>(null);
  const [selectedReturnPolicyId, setSelectedReturnPolicyId] = useState<string | null>(null);
  const [selectedWarrantyPolicyId, setSelectedWarrantyPolicyId] = useState<string | null>(null);

  const [availableCampaigns, setAvailableCampaigns] = useState<CampaignOption[]>([]);
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [weight, setWeight] = useState<number>(0);
  const [dimensions, setDimensions] = useState<{ length?: number; width?: number; height?: number }>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadProductAndMarketingData() {
      try {
        setLoading(true);
        setFetchError(null);

        // 1. Fetch store policies, campaigns
        const [policiesRes, campaignsRes, storePoliciesRes] = await Promise.all([
          fetch("/api/vendor/shipping-policies"),
          fetch("/api/vendor/campaigns"),
          fetch("/api/vendor/policies"),
        ]);
        if (policiesRes.ok) {
          const policiesData = await policiesRes.json();
          setAvailablePolicies(policiesData.policies || []);
        }
        if (campaignsRes.ok) {
          const cData = await campaignsRes.json();
          setAvailableCampaigns(cData.campaigns || []);
        }
        if (storePoliciesRes.ok) {
          const pData = await storePoliciesRes.json();
          if (pData.policies) {
            setRefundPolicies(pData.policies.refund || []);
            setReturnPolicies(pData.policies.return || []);
            setWarrantyPolicies(pData.policies.warranty || []);
          }
        }

        // 2. Fetch product details
        const res = await fetch(`/api/vendor/products/${productId}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to load product details");
        }
        const data = await res.json();
        const p = data.product;
        if (p) {
          setProductData({
            name: p.name || "",
            brand: p.brand || "",
            description: p.description || "",
            category: p.categoryName || "General",
            price: p.price || 0,
            compareAtPrice: p.compareAtPrice || 0,
            stock: p.stock || 0,
            status: p.status || "ACTIVE",
          });
          setImages(Array.isArray(p.images) ? p.images : []);
          setWeight(p.weight || 0);
          if (p.dimensions) setDimensions(p.dimensions);
          if (Array.isArray(p.shippingPolicyIds)) {
            setSelectedPolicyIds(p.shippingPolicyIds);
          }
          if (p.refundPolicyId) setSelectedRefundPolicyId(p.refundPolicyId);
          if (p.returnPolicyId) setSelectedReturnPolicyId(p.returnPolicyId);
          if (p.warrantyPolicyId) setSelectedWarrantyPolicyId(p.warrantyPolicyId);

          if (p.isFeatured !== undefined) {
            setIsFeatured(Boolean(p.isFeatured));
          }
          if (Array.isArray(p.campaignIds)) {
            setSelectedCampaignIds(p.campaignIds);
          }
          if (Array.isArray(p.variants)) {
            setVariants(p.variants);
          }
        }
      } catch (err: any) {
        setFetchError(err.message || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    }
    loadProductAndMarketingData();
  }, [productId]);

  const updateProduct = async (targetStatus?: "DRAFT" | "ACTIVE") => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    if (!productData.name.trim()) {
      setSaveError("Please enter a product name.");
      setSaving(false);
      return;
    }
    if (!productData.price || productData.price <= 0) {
      setSaveError("Please enter a valid selling price greater than 0.");
      setSaving(false);
      return;
    }

    const newStatus = targetStatus || productData.status;

    try {
      const res = await fetch(`/api/vendor/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productData.name.trim(),
          brand: productData.brand.trim() || undefined,
          description: productData.description.trim() || undefined,
          price: productData.price,
          compareAtPrice: productData.compareAtPrice > 0 ? productData.compareAtPrice : undefined,
          stock: productData.stock,
          categoryName: productData.category.trim() || "General",
          images,
          variants,
          weight: weight > 0 ? weight : undefined,
          dimensions,
          shippingPolicyIds: selectedPolicyIds,
          refundPolicyId: selectedRefundPolicyId,
          returnPolicyId: selectedReturnPolicyId,
          warrantyPolicyId: selectedWarrantyPolicyId,
          campaignIds: selectedCampaignIds,
          isFeatured,
          status: newStatus,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to update product");
      }

      setSaveSuccess("Product updated successfully!");
      setTimeout(() => {
        router.push(`/vendor/products/${productId}`);
      }, 800);
    } catch (e: any) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = () => updateProduct("DRAFT");
  const handlePublish = () => updateProduct("ACTIVE");

  const sections = [
    "Basic Information",
    "Media",
    "Category",
    "Pricing",
    "Inventory",
    "Variants",
    "Shipping",
    "Marketing & Labels",
    "SEO",
  ];

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const id = `section-${section.toLowerCase().replace(/\s+/g, "-")}`;
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <VendorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <VendorTopbar onMenuClick={() => setSidebarOpen(true)} breadcrumbs={[{ label: "Dashboard", href: "/vendor" }, { label: "Products", href: "/vendor/products" }, { label: "Edit Product" }]} />
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-center">
              <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">Loading Product Data...</h3>
              <p className="text-sm text-gray-500 mt-1">Retrieving product specs for editing</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <VendorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <VendorTopbar onMenuClick={() => setSidebarOpen(true)} breadcrumbs={[{ label: "Dashboard", href: "/vendor" }, { label: "Products", href: "/vendor/products" }, { label: "Edit Product" }]} />
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="bg-white p-8 rounded-2xl border max-w-md w-full text-center shadow-sm">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h3>
              <p className="text-sm text-gray-600 mb-6">{fetchError}</p>
              <Link href="/vendor/products">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Return to Product Catalog</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <VendorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <VendorTopbar
          onMenuClick={() => setSidebarOpen(true)}
          breadcrumbs={[
            { label: "Dashboard", href: "/vendor" },
            { label: "Products", href: "/vendor/products" },
            { label: productData.name || "Edit Product" },
          ]}
        />

        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b shadow-sm p-2 overflow-x-auto">
          <div className="flex gap-2 max-w-7xl mx-auto px-4 min-w-max">
            {sections.map((section) => {
              const isActive = activeSection === section;
              return (
                <button
                  key={section}
                  type="button"
                  onClick={() => scrollToSection(section)}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {section}
                </button>
              );
            })}
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <Link href={`/vendor/products/${productId}`}>
              <Button variant="ghost" className="gap-2 mb-4 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" />
                Back to Workspace Details
              </Button>
            </Link>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 mb-0.5">
                  Edit Product Details
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Update product specs, brand, pricing, inventory, category, and media
                </p>
              </div>
            </div>

            {saveSuccess && (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm mb-4 font-semibold">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                {saveSuccess}
              </div>
            )}

            {saveError && (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {saveError}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div id="section-basic-information">
                <ProductBasicInfo
                  name={productData.name}
                  onNameChange={(name) => setProductData((prev) => ({ ...prev, name }))}
                  brand={productData.brand}
                  onBrandChange={(brand) => setProductData((prev) => ({ ...prev, brand }))}
                  description={productData.description}
                  onDescriptionChange={(description) => setProductData((prev) => ({ ...prev, description }))}
                />
              </div>

              <div id="section-media">
                <MediaUploader initialImages={images} onImagesChange={setImages} />
              </div>

              <div id="section-category">
                <CategorySelector
                  category={productData.category}
                  onCategoryChange={(category) => setProductData((prev) => ({ ...prev, category }))}
                />
              </div>

              <div id="section-pricing">
                <PricingCard
                  price={productData.price}
                  onPriceChange={(price) => setProductData((prev) => ({ ...prev, price }))}
                  compareAtPrice={productData.compareAtPrice}
                  onComparePriceChange={(compareAtPrice) => setProductData((prev) => ({ ...prev, compareAtPrice }))}
                />
              </div>

              <div id="section-inventory">
                <InventoryCard
                  stock={productData.stock}
                  onStockChange={(stock) => setProductData((prev) => ({ ...prev, stock }))}
                />
              </div>

              <div id="section-variants">
                <VariantManager
                  initialVariants={variants}
                  basePrice={productData.price}
                  baseStock={productData.stock}
                  onVariantsChange={setVariants}
                />
              </div>

              <div id="section-shipping" className="space-y-6">
                <ShippingCard
                  availablePolicies={availablePolicies}
                  selectedPolicyIds={selectedPolicyIds}
                  onChangePolicyIds={setSelectedPolicyIds}
                  weight={weight}
                  onChangeWeight={setWeight}
                  length={dimensions.length}
                  width={dimensions.width}
                  height={dimensions.height}
                  onChangeDimensions={setDimensions}
                />
                <PoliciesCard
                  refundPolicies={refundPolicies}
                  returnPolicies={returnPolicies}
                  warrantyPolicies={warrantyPolicies}
                  refundPolicyId={selectedRefundPolicyId}
                  returnPolicyId={selectedReturnPolicyId}
                  warrantyPolicyId={selectedWarrantyPolicyId}
                  onChangeRefundPolicyId={setSelectedRefundPolicyId}
                  onChangeReturnPolicyId={setSelectedReturnPolicyId}
                  onChangeWarrantyPolicyId={setSelectedWarrantyPolicyId}
                />
              </div>

              <div id="section-marketing-&-labels">
                <MarketingCard
                  availableCampaigns={availableCampaigns}
                  selectedCampaignIds={selectedCampaignIds}
                  onChangeCampaignIds={setSelectedCampaignIds}
                />
              </div>

              <div id="section-seo">
                <SeoCard />
              </div>
            </div>

            <div className="lg:col-span-1">
              <PublishPanel
                onPublish={handlePublish}
                onSaveDraft={handleSaveDraft}
                productData={productData}
                images={images}
                saving={saving}
                isFeatured={isFeatured}
                onIsFeaturedChange={setIsFeatured}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
