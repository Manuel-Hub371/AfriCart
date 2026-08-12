"use client";

import { useState, useEffect, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Edit, 
  ExternalLink, 
  Trash2, 
  Save, 
  Loader2, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Star, 
  ShoppingCart, 
  Eye, 
  Sparkles, 
  Search, 
  History, 
  AlertTriangle,
  Plus,
  Minus,
  Check
} from "lucide-react";

interface ProductWorkspaceProps {
  params: Promise<{ id: string }>;
}

export default function ProductWorkspacePage({ params }: ProductWorkspaceProps) {
  const router = useRouter();
  const { id: productId } = use(params);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "inventory" | "pricing" | "marketing" | "analytics" | "orders" | "reviews" | "seo" | "activity"
  >("overview");

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editable local state
  const [stockInput, setStockInput] = useState<number>(0);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(10);
  const [priceInput, setPriceInput] = useState<number>(0);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [statusInput, setStatusInput] = useState<string>("ACTIVE");
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDesc, setMetaDesc] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");

  // Product Orders & Reviews state
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const fetchProduct = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/vendor/products/${productId}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to load product");
      }
      const data = await res.json();
      const p = data.product;
      setProduct(p);
      setStockInput(p.stock ?? 0);
      setPriceInput(p.price ?? 0);
      setIsFeatured(p.isFeatured ?? false);
      setStatusInput(p.status ?? "ACTIVE");
      setMetaTitle(p.metaTitle || p.name || "");
      setMetaDesc(p.metaDescription || p.description || "");
      setKeywords(p.keywords || "");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Load orders & reviews containing this product
  useEffect(() => {
    async function loadRelatedData() {
      try {
        const [ordersRes, reviewsRes] = await Promise.all([
          fetch("/api/vendor/orders"),
          fetch("/api/vendor/reviews"),
        ]);
        if (ordersRes.ok) {
          const oData = await ordersRes.json();
          const filtered = (oData.orders || []).filter((o: any) =>
            o.orderItems?.some((item: any) => item.productId === productId || item.product?.id === productId)
          );
          setOrders(filtered);
        }
        if (reviewsRes.ok) {
          const rData = await reviewsRes.json();
          const filtered = (rData.reviews || []).filter((r: any) => r.productId === productId);
          setReviews(filtered);
        }
      } catch {
        // ignore error
      }
    }
    loadRelatedData();
  }, [productId]);

  const handleUpdateProduct = async (patchData: any) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/vendor/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to update product");
      }
      const updated = await res.json();
      setProduct(updated.product);
      alert("Product updated successfully!");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/vendor/products/${productId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/vendor/products");
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mr-3" />
        <span className="text-gray-600 font-medium">Loading Product Workspace...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-md">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">{error || "The requested product does not exist or you lack ownership permissions."}</p>
          <Button onClick={() => router.push("/vendor/products")} className="bg-emerald-600 text-white rounded-xl">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const selectedImage = product.images?.[0] || "";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <VendorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <VendorTopbar
          onMenuClick={() => setSidebarOpen(true)}
          breadcrumbs={[
            { label: "Dashboard", href: "/vendor" },
            { label: "Products", href: "/vendor/products" },
            { label: product.name },
          ]}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto pb-24">
            {/* Top Workspace Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 border-b border-gray-200 pb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/vendor/products")}
                  className="rounded-xl border-gray-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-extrabold text-gray-900">{product.name}</h1>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                        product.status === "ACTIVE" || product.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : product.status === "DRAFT"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.status}
                    </span>
                    {product.isFeatured && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    SKU: <span className="font-mono text-gray-700 font-bold">{product.id.slice(0, 8).toUpperCase()}</span> • Category: <span className="font-semibold text-gray-800">{product.categoryName || "General"}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => window.open(`/product/${product.id}`, "_blank")}
                  className="rounded-xl border-gray-200 text-gray-700"
                >
                  <ExternalLink className="h-4 w-4 mr-2" /> View Storefront
                </Button>
                <Button
                  onClick={() => router.push(`/vendor/products/${product.id}/edit`)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold"
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit Details
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleDeleteProduct}
                  className="text-red-600 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Product Overview Quick Header Card */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden border flex-shrink-0">
                  <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Base Price</p>
                  <h3 className="text-2xl font-extrabold text-gray-900">GH₵{product.price.toFixed(2)}</h3>
                </div>
              </div>

              <div className="border-l pl-6 space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase">Current Inventory</p>
                <h3 className={`text-2xl font-extrabold ${product.stock <= 10 ? "text-amber-600" : "text-gray-900"}`}>
                  {product.stock} units
                </h3>
                <p className="text-xs text-gray-500">
                  {product.stock === 0 ? "Out of stock" : product.stock <= 10 ? "Low stock warning" : "In Stock"}
                </p>
              </div>

              <div className="border-l pl-6 space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase">Customer Rating</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-extrabold text-amber-500">★ {(product.rating || 5.0).toFixed(1)}</h3>
                  <span className="text-xs text-gray-400">({product.numReviews || reviews.length} reviews)</span>
                </div>
                <p className="text-xs text-gray-500">Verified buyer feedback</p>
              </div>

              <div className="border-l pl-6 space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase">Orders Fulfilled</p>
                <h3 className="text-2xl font-extrabold text-emerald-600">{orders.length} orders</h3>
                <p className="text-xs text-gray-500">Total order line items</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-6 overflow-x-auto thin-scrollbar">
              <div className="flex gap-2 pb-2 min-w-max">
                {[
                  { id: "overview", label: "Overview & Specs", icon: Package },
                  { id: "inventory", label: "Inventory Management", icon: Package },
                  { id: "pricing", label: "Pricing & Discounts", icon: DollarSign },
                  { id: "marketing", label: "Marketing & Promo", icon: Sparkles },
                  { id: "analytics", label: "Product Analytics", icon: TrendingUp },
                  { id: "orders", label: `Orders (${orders.length})`, icon: ShoppingCart },
                  { id: "reviews", label: `Reviews (${reviews.length})`, icon: Star },
                  { id: "seo", label: "SEO & Search", icon: Search },
                  { id: "activity", label: "Activity Log", icon: History },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB CONTENTS */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 lg:p-8 shadow-sm">
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 border-b pb-3">Product Description &amp; Details</h3>
                  <div className="prose max-w-none text-gray-700 text-sm leading-relaxed">
                    {product.description || "No description provided."}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Product ID / UUID</p>
                      <p className="text-sm font-mono font-bold text-gray-900">{product.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Date Created</p>
                      <p className="text-sm font-bold text-gray-900">{new Date(product.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Last Updated</p>
                      <p className="text-sm font-bold text-gray-900">{new Date(product.updatedAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Store Ownership</p>
                      <p className="text-sm font-bold text-emerald-600">{product.store?.name || "Your Vendor Store"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INVENTORY */}
              {activeTab === "inventory" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Inventory Management Workspace</h3>
                    <p className="text-xs text-gray-500">Adjust stock levels in real time and configure inventory threshold alerts.</p>
                  </div>

                  <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-200 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <label className="font-extrabold text-gray-900 text-sm">Available Units in Stock</label>
                        <p className="text-xs text-gray-500">Update available merchandise count</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStockInput((s) => Math.max(0, s - 1))}
                          className="h-10 w-10 p-0 rounded-xl"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={stockInput}
                          onChange={(e) => setStockInput(Number(e.target.value))}
                          className="w-28 text-center font-extrabold text-lg bg-white rounded-xl h-10"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStockInput((s) => s + 1)}
                          className="h-10 w-10 p-0 rounded-xl"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                      <div className="space-y-1">
                        <label className="font-bold text-gray-900 text-xs">Low Stock Alert Threshold</label>
                        <Input
                          type="number"
                          value={lowStockThreshold}
                          onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                          className="bg-white rounded-xl text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-gray-900 text-xs">Status Override</label>
                        <select
                          value={statusInput}
                          onChange={(e) => setStatusInput(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm bg-white"
                        >
                          <option value="ACTIVE">ACTIVE (Published)</option>
                          <option value="DRAFT">DRAFT (Hidden)</option>
                          <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleUpdateProduct({ stock: stockInput, status: statusInput })}
                      disabled={isSaving}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6"
                    >
                      <Save className="h-4 w-4 mr-2" /> {isSaving ? "Saving..." : "Save Stock Adjustment"}
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB 3: PRICING */}
              {activeTab === "pricing" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Pricing &amp; Discount Configuration</h3>
                    <p className="text-xs text-gray-500">Configure base price, promotional discount price, and profit parameters.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 p-6 bg-gray-50/50 rounded-2xl border border-gray-200">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-900 text-sm">Regular Base Price (GH₵)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={priceInput}
                        onChange={(e) => setPriceInput(Number(e.target.value))}
                        className="bg-white rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={() => handleUpdateProduct({ price: priceInput })}
                      disabled={isSaving}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6"
                    >
                      <Save className="h-4 w-4 mr-2" /> {isSaving ? "Saving..." : "Save Price Adjustments"}
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB 4: MARKETING */}
              {activeTab === "marketing" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Marketing &amp; Storefront Highlights</h3>
                    <p className="text-xs text-gray-500">Promote this product on your vendor homepage and buyer search rankings.</p>
                  </div>

                  <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-600" /> Featured Storefront Highlight
                      </h4>
                      <p className="text-xs text-gray-600">Feature this product in your store top banner</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="h-5 w-5 text-amber-600 rounded"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleUpdateProduct({ isFeatured })}
                      disabled={isSaving}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6"
                    >
                      <Save className="h-4 w-4 mr-2" /> {isSaving ? "Saving..." : "Update Marketing Status"}
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB 5: ANALYTICS */}
              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 border-b pb-3">Product Sales &amp; Performance Analytics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                      <p className="text-xs font-bold text-emerald-800 uppercase">Product Generated Revenue</p>
                      <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">
                        ${(orders.length * product.price).toFixed(2)}
                      </h3>
                    </div>
                    <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                      <p className="text-xs font-bold text-blue-800 uppercase">Purchased Line Items</p>
                      <h3 className="text-3xl font-extrabold text-blue-600 mt-1">{orders.length}</h3>
                    </div>
                    <div className="p-6 bg-purple-50/50 rounded-2xl border border-purple-100">
                      <p className="text-xs font-bold text-purple-800 uppercase">Storefront Views</p>
                      <h3 className="text-3xl font-extrabold text-purple-600 mt-1">{product.views ?? 0}</h3>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: ORDERS */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 border-b pb-3">Orders Containing This Product</h3>
                  {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-xs uppercase text-gray-400 font-bold">
                            <th className="text-left py-3 px-4">Order ID</th>
                            <th className="text-left py-3 px-4">Customer</th>
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-left py-3 px-4">Date</th>
                            <th className="text-right py-3 px-4">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((o) => (
                            <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                              <td className="py-3 px-4 font-mono font-bold text-sm text-gray-900">#{o.id.slice(0, 8).toUpperCase()}</td>
                              <td className="py-3 px-4 text-sm text-gray-700">{o.customerName || "Customer"}</td>
                              <td className="py-3 px-4 text-xs font-bold text-emerald-600">{o.status}</td>
                              <td className="py-3 px-4 text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                              <td className="py-3 px-4 text-right font-bold text-gray-900">GH₵{Number(o.totalAmount).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-12">No orders recorded for this product yet.</p>
                  )}
                </div>
              )}

              {/* TAB 7: REVIEWS */}
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 border-b pb-3">Product Customer Reviews</h3>
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((r) => (
                        <div key={r.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm text-gray-900">{r.customerName || "Verified Buyer"}</span>
                            <span className="text-amber-500 font-bold text-sm">★ {r.rating}.0</span>
                          </div>
                          <p className="text-xs text-gray-600">{r.comment || "No written review."}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-12">No customer reviews posted for this product yet.</p>
                  )}
                </div>
              )}

              {/* TAB 8: SEO */}
              {activeTab === "seo" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">SEO &amp; Search Engine Optimization</h3>
                    <p className="text-xs text-gray-500">Manage search engine title, description, and key metadata tags.</p>
                  </div>

                  <div className="space-y-4 p-6 bg-gray-50/50 rounded-2xl border border-gray-200">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-900 text-xs">SEO Meta Title</label>
                      <Input
                        type="text"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        className="bg-white rounded-xl text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-900 text-xs">Meta Description</label>
                      <textarea
                        rows={3}
                        value={metaDesc}
                        onChange={(e) => setMetaDesc(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-500 focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleUpdateProduct({ metaTitle, metaDescription: metaDesc })}
                      disabled={isSaving}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6"
                    >
                      <Save className="h-4 w-4 mr-2" /> {isSaving ? "Saving..." : "Save SEO Tags"}
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB 9: ACTIVITY */}
              {activeTab === "activity" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 border-b pb-3">Product Activity Audit Trail</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-sm text-gray-700">
                      <Check className="h-4 w-4 text-emerald-600 mt-0.5" />
                      <div>
                        <p className="font-bold text-gray-900">Product Created</p>
                        <p className="text-xs text-gray-500">{new Date(product.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-gray-700">
                      <Check className="h-4 w-4 text-emerald-600 mt-0.5" />
                      <div>
                        <p className="font-bold text-gray-900">Last Details Update</p>
                        <p className="text-xs text-gray-500">{new Date(product.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
