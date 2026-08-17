import { db } from "../lib/db";
import { vendorRepository } from "../modules/vendor/repository";
import { catalogService } from "../modules/catalog/service";
import { normalizeImages, extractCoverImage } from "../lib/image-utils";

async function runVendorImageAudit() {
  console.log("=================================================");
  console.log("AFRICART VENDOR PRODUCT IMAGE PERSISTENCE AUDIT");
  console.log("=================================================\n");

  let testPassed = 0;
  let testFailed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      testPassed++;
    } else {
      console.error(`❌ [FAIL] ${testName} - ${detail || "Assertion failed"}`);
      testFailed++;
    }
  }

  try {
    const timeTag = Date.now();

    // 1. Setup Test User, Vendor, Store
    const user = await db.user.create({
      data: {
        email: `image_vendor_${timeTag}@africart.test`,
        passwordHash: "dummy",
        firstName: "ImageTest",
        lastName: "Vendor",
        status: "ACTIVE",
      },
    });

    const vendor = await db.vendorProfile.create({
      data: {
        userId: user.id,
        businessName: "Image Test Vendor Store",
        businessCategory: "Electronics",
        country: "Ghana",
        region: "Greater Accra",
        city: "Accra",
        businessAddress: "1 Media St",
      },
    });

    const store = await db.store.create({
      data: {
        vendorProfileId: vendor.id,
        name: "Image Test Store",
        slug: `image-test-store-${timeTag}`,
        status: "ACTIVE",
        isPublic: true,
      },
    });

    const customVendorUploadedImages = [
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "https://cdn.africart.shop/vendor/uploads/custom-camera-front.jpg",
      "https://cdn.africart.shop/vendor/uploads/custom-camera-back.jpg"
    ];

    // 2. Test Product Creation with Vendor Uploaded Custom Images
    const createdProduct = await vendorRepository.createVendorProduct(store.id, {
      name: "Custom Vendor DSLR Camera 4K",
      brand: "Canon",
      description: "Brand new 4K DSLR Camera with custom vendor uploaded media",
      price: 4500,
      stock: 5,
      categoryName: "Electronics",
      images: customVendorUploadedImages,
    });

    assert(Boolean(createdProduct.id), "Product created successfully");

    // 3. Verify Database Storage
    const dbProduct = await db.product.findUnique({
      where: { id: createdProduct.id },
    });

    const normalizedDbImages = normalizeImages(dbProduct?.images);
    assert(
      normalizedDbImages.length === 3 && normalizedDbImages[0] === customVendorUploadedImages[0],
      "Vendor uploaded images stored intact in PostgreSQL DB without being wiped or converted to empty array",
      `Expected ${customVendorUploadedImages[0]}, got ${normalizedDbImages[0]}`
    );

    // 4. Verify Catalog Service API formatting
    const catalogProduct = await catalogService.getProductDetails(createdProduct.id);

    assert(
      catalogProduct.images.length === 3 && catalogProduct.images[0] === customVendorUploadedImages[0],
      "Catalog Service API returns vendor's exact uploaded images",
      `Got catalog images: ${JSON.stringify(catalogProduct.images)}`
    );

    // 5. Verify Cover Image Extraction
    const coverImage = extractCoverImage(catalogProduct.images, catalogProduct.name, catalogProduct.category);
    assert(
      coverImage === customVendorUploadedImages[0],
      "Cover image extraction resolves vendor's custom primary image",
      `Expected ${customVendorUploadedImages[0]}, got ${coverImage}`
    );

    // Clean up created entities
    await db.product.delete({ where: { id: createdProduct.id } });
    await db.store.delete({ where: { id: store.id } });
    await db.vendorProfile.delete({ where: { id: vendor.id } });
    await db.user.delete({ where: { id: user.id } });

    console.log("\n=================================================");
    console.log(`AUDIT COMPLETE: ${testPassed} Passed, ${testFailed} Failed`);
    console.log("=================================================");
  } catch (err) {
    console.error("Test execution error:", err);
  } finally {
    await db.$disconnect();
  }
}

runVendorImageAudit();
