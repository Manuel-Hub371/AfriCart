import { PrismaClient } from "@prisma/client";

const db = new PrismaClient({ log:["query","error"] });
const t0 = Date.now();
const log = (m) => console.log(`[${Date.now()-t0}ms] ${m}`);

async function main() {
  log("connecting...");
  try {
    await db.$connect();
    log("connected");
  } catch (e) {
    log("connect ERROR: " + e.message);
    process.exit(1);
  }

  log("findProducts featured...");
  let t=Date.now();
  await db.product.findMany({ where:{deletedAt:null,status:"ACTIVE",store:{status:"ACTIVE",deletedAt:null},isFeatured:true}, include:{store:{select:{id:true,name:true,slug:true,logo:true}},category:true,campaignProducts:{include:{campaign:true}}}, orderBy:{createdAt:"desc"}, take:8 });
  log("  done "+(Date.now()-t)+"ms");

  log("findCategories (9 sequential counts)...");
  t=Date.now();
  const cats=["Electronics & Gadget","Home & Living","Fashion & Appeal","Beauty & Personal Care","Food & Gorrices","Pharmacy & Health","Automotive & Automobile","Sorts & Fitness","Books & Stationery"];
  for (const c of cats) {
    await db.product.count({ where:{deletedAt:null,status:"ACTIVE",store:{status:"ACTIVE",deletedAt:null},OR:[{categoryName:{equals:c,mode:"insensitive"}},{categoryName:{equals:c,mode:"insensitive"}},{category:{slug:{equals:c,mode:"insensitive"}}}]} });
  }
  log("  done "+(Date.now()-t)+"ms");

  log("findStores...");
  t=Date.now();
  await db.store.findMany({ where:{deletedAt:null,isPublic:true,status:"ACTIVE"}, include:{categories:{include:{storeCategory:true}},vendorProfile:{select:{identityVerified:true,businessVerified:true,city:true,region:true,country:true}},products:{where:{deletedAt:null,status:"ACTIVE"},select:{id:true,rating:true,numReviews:true}},_count:{select:{products:{where:{deletedAt:null,status:"ACTIVE"}},followers:true}}}, orderBy:{createdAt:"desc"} });
  log("  done "+(Date.now()-t)+"ms");

  await db.$disconnect();
  log("done");
}
main().catch(e=>{ console.error(e); process.exit(1); });