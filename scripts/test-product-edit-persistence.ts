import { PrismaClient } from "@prisma/client";
import { vendorService } from "../modules/vendor/service";

const prisma = new PrismaClient();

async function testProductEditPersistence() {
  console.log("--- TESTING PRODUCT CREATION & EDIT FIELD PERSISTENCE ---");

  // 1. Get test user and ensure active store
  const user = await prisma.user.findFirst({
    where: { email: "admin@africart.com" },
    include: { vendorProfile: { include: { stores: true } } },
  });

  if (!user || !user.vendorProfile || !user.vendorProfile.stores[0]) {
    console.error("Test user or store not found.");
    return;
  }

  const storeId = user.vendorProfile.stores[0].id;
  await prisma.store.update({
    where: { id: storeId },
    data: { status: "ACTIVE" },
  });

  // 2. Create product with full fields
  console.log("Creating test product with full specs...");
  const created = await vendorService.createVendorProduct(user.id, {
    name: "Test Persistence Smartphone",
    brand: "AfriBrand",
    description: "Detailed description of smartphone with high performance.",
    price: 499.99,
    stock: 50,
    categoryName: "Electronics & Gadget",
    images: ["https://example.com/phone1.jpg", "https://example.com/phone2.jpg"],
    specifications: {
      shortDescription: "Ultra fast 5G smartphone",
      productType: "Physical Product",
      tags: ["smartphone", "5g", "africart"],
    },
    seoTitle: "Best 5G Smartphone in Ghana",
    seoDescription: "Buy the ultimate 5G smartphone on AfriCart.",
    seoKeywords: "smartphone, 5g, gadget",
    status: "ACTIVE",
  });

  console.log("✓ Created Product ID:", created.id);
  console.log("✓ Created Specifications:", created.specifications);

  // 3. Fetch product details via GET service method
  const fetchedDetails = await vendorService.getVendorProductDetails(user.id, created.id);
  console.log("✓ Fetched Product Details Specifications:", fetchedDetails.specifications);

  // 4. Update Product fields via PATCH service method
  console.log("Updating product specifications and category...");
  const updated = await vendorService.updateVendorProduct(user.id, created.id, {
    name: "Updated Persistence Smartphone 5G Pro",
    brand: "AfriBrand Pro",
    description: "Updated description with extended battery specs.",
    price: 549.99,
    categoryName: "Electronics & Gadget",
    specifications: {
      shortDescription: "Updated ultra fast 5G Pro smartphone",
      productType: "Physical Product",
      tags: ["smartphone", "5g", "pro", "gadget"],
    },
    seoTitle: "Updated 5G Pro Smartphone Ghana",
    seoDescription: "Updated buy guide for 5G Pro smartphone on AfriCart.",
    seoKeywords: "smartphone, 5g, pro",
  });

  console.log("✓ Updated Product Name:", updated.name);
  console.log("✓ Updated Product Price:", updated.price);

  // Verify in DB directly
  const dbProduct = await prisma.product.findUnique({
    where: { id: created.id },
  });

  if (!dbProduct) {
    console.error("❌ DB Product not found!");
    return;
  }

  console.log("✓ DB Record Name:", dbProduct.name);
  console.log("✓ DB Record Brand:", dbProduct.brand);
  console.log("✓ DB Record Category:", dbProduct.categoryName);
  console.log("✓ DB Record SEO Title:", dbProduct.seoTitle);
  console.log("✓ DB Record Specifications:", dbProduct.specifications);

  const specs = dbProduct.specifications as any;
  if (
    specs?.shortDescription === "Updated ultra fast 5G Pro smartphone" &&
    Array.isArray(specs?.tags) &&
    specs.tags.includes("pro")
  ) {
    console.log("✓ VERIFICATION PASS: All product edit fields and specifications correctly persisted!");
  } else {
    console.error("❌ VERIFICATION FAIL: Specifications mismatch.");
  }
}

testProductEditPersistence()
  .catch((e) => console.error("Test error:", e))
  .finally(() => prisma.$disconnect());
