/**
 * Sabhe Furniture – Appwrite Database Setup Script
 * 
 * Prerequisites:
 *   1. Go to https://fra.cloud.appwrite.io/console/project-69fad27100189847d507/databases
 *   2. Click "Create Database"
 *   3. Name: "Sabhe Furniture"  |  ID: "sabhe_furniture"  |  Click Create
 *   4. Then run: node scripts/setup-db.mjs
 */

import { Client, Databases, Storage, Permission, Role } from "node-appwrite";

const PROJECT_ID   = "69fad27100189847d507";
const API_KEY      = "standard_aea69da0c8b33fcbfba1746ddc66ec965365224842367a2748059b1a2fd6484f3b51a27d3da6605adad9645f8f86fc5ad8d1048d56bb4ea09aea7d6e5205c9556d4e698ce100ba722b9e6e2a4031029529b5d7bade1bf8534220e94fa4b0da37773bcf10808788b6dbbbf9404e32dc8e11cba3c5f210093dc945eb3490675c34";
const ENDPOINT     = "https://fra.cloud.appwrite.io/v1";
const DATABASE_ID  = "database-69fad4ec001a1f46c410";

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const db      = new Databases(client);
const storage = new Storage(client);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
async function safe(label, fn) {
  try {
    const r = await fn();
    console.log(`  ✅ ${label}`);
    return r;
  } catch (e) {
    if (e?.code === 409) {
      console.log(`  ⏭  ${label} (already exists)`);
    } else {
      console.error(`  ❌ ${label}: ${e.message}`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Products Collection
// ─────────────────────────────────────────────────────────────────────────────
async function setupProducts() {
  console.log("\n📦 Setting up 'products' collection...");

  await safe("Create collection", () =>
    db.createCollection(DATABASE_ID, "products", "Products", [
      Permission.read(Role.any()),
      Permission.create(Role.label("admin")),
      Permission.update(Role.label("admin")),
      Permission.delete(Role.label("admin")),
    ])
  );

  const attrs = [
    () => db.createStringAttribute(DATABASE_ID, "products", "title",       255, true),
    () => db.createStringAttribute(DATABASE_ID, "products", "description", 2000, true),
    () => db.createFloatAttribute( DATABASE_ID, "products", "price",       true, 0),
    () => db.createStringAttribute(DATABASE_ID, "products", "image",       2000, false, ""),
    () => db.createStringAttribute(DATABASE_ID, "products", "category",    100,  true),
    () => db.createBooleanAttribute(DATABASE_ID, "products", "inStock",    true, true),
    () => db.createBooleanAttribute(DATABASE_ID, "products", "featured",   false, false),
    () => db.createFloatAttribute( DATABASE_ID, "products", "discount",    false, 0, 0, 100),
    () => db.createFloatAttribute( DATABASE_ID, "products", "rating",      false, 0, 0, 5),
  ];

  const names = ["title","description","price","image","category","inStock","featured","discount","rating"];
  for (let i = 0; i < attrs.length; i++) {
    await safe(`Attribute: ${names[i]}`, attrs[i]);
    await new Promise(r => setTimeout(r, 500)); // avoid rate limit
  }

  // Wait for Appwrite to process attributes before creating indexes
  console.log("  ⏳ Waiting 5s for attributes to activate...");
  await new Promise(r => setTimeout(r, 5000));

  await safe("Index: category", () =>
    db.createIndex(DATABASE_ID, "products", "idx_category", 'key', ["category"])
  );
  await safe("Index: featured", () =>
    db.createIndex(DATABASE_ID, "products", "idx_featured", 'key', ["featured"])
  );
  await safe("Fulltext: title", () =>
    db.createIndex(DATABASE_ID, "products", "idx_title_ft", 'fulltext', ["title"])
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Categories Collection
// ─────────────────────────────────────────────────────────────────────────────
async function setupCategories() {
  console.log("\n🗂  Setting up 'categories' collection...");

  await safe("Create collection", () =>
    db.createCollection(DATABASE_ID, "categories", "Categories", [
      Permission.read(Role.any()),
      Permission.create(Role.label("admin")),
      Permission.update(Role.label("admin")),
      Permission.delete(Role.label("admin")),
    ])
  );

  const attrs = [
    () => db.createStringAttribute(DATABASE_ID, "categories", "name",        100,  true),
    () => db.createStringAttribute(DATABASE_ID, "categories", "slug",        100,  true),
    () => db.createStringAttribute(DATABASE_ID, "categories", "description", 500,  false, ""),
    () => db.createStringAttribute(DATABASE_ID, "categories", "image",       2000, false, ""),
  ];
  const names = ["name","slug","description","image"];
  for (let i = 0; i < attrs.length; i++) {
    await safe(`Attribute: ${names[i]}`, attrs[i]);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("  ⏳ Waiting 5s for attributes to activate...");
  await new Promise(r => setTimeout(r, 5000));

  await safe("Unique index: slug", () =>
    db.createIndex(DATABASE_ID, "categories", "idx_slug", 'unique', ["slug"])
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Storage Bucket
// ─────────────────────────────────────────────────────────────────────────────
async function setupStorage() {
  console.log("\n🗄  Setting up 'product_images' storage bucket...");

  await safe("Create bucket", () =>
    storage.createBucket("product_images", "Product Images", [
      Permission.read(Role.any()),
      Permission.create(Role.label("admin")),
      Permission.update(Role.label("admin")),
      Permission.delete(Role.label("admin")),
    ], false, undefined, 10_000_000, ["image/jpeg","image/png","image/webp"])
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Seed Data
// ─────────────────────────────────────────────────────────────────────────────
async function seedCategories() {
  console.log("\n🌱 Seeding categories...");

  const cats = [
    { name: "Sofas",   slug: "sofas",   description: "Comfortable seating for every living space.", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600" },
    { name: "Tables",  slug: "tables",  description: "Dining, coffee, and office tables.",           image: "https://images.unsplash.com/photo-1617806118233-18e1c0945620?auto=format&fit=crop&q=80&w=600" },
    { name: "Beds",    slug: "beds",    description: "Elegant bed frames for peaceful sleep.",       image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=600" },
    { name: "Chairs",  slug: "chairs",  description: "Dining, office, and lounge chairs.",           image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600" },
    { name: "Storage", slug: "storage", description: "Wardrobes, shelves, and TV units.",            image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=80&w=600" },
  ];

  for (const cat of cats) {
    await safe(`Category: ${cat.name}`, () =>
      db.createDocument(DATABASE_ID, "categories", "unique()", cat)
    );
  }
}

async function seedProducts() {
  console.log("\n🌱 Seeding products...");

  const products = [
    { title:"Modern Sofa",            description:"Plush, comfortable seating with premium fabric.",         price:25000, image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600&h=600", category:"sofas",   inStock:true,  featured:true,  discount:0,  rating:4.8 },
    { title:"Lounge Armchair",        description:"Cozy velvet upholstery reading chair.",                   price:14000, image:"https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=600&h=600", category:"chairs",  inStock:true,  featured:true,  discount:10, rating:4.7 },
    { title:"Wooden Dining Table",    description:"Sturdy oak dining table, seats six.",                     price:18000, image:"https://images.unsplash.com/photo-1617806118233-18e1c0945620?auto=format&fit=crop&q=80&w=600&h=600", category:"tables",  inStock:true,  featured:false, discount:0,  rating:4.9 },
    { title:"Queen Size Bed",         description:"Elegant wooden frame with premium finish.",               price:35000, image:"https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=600&h=600", category:"beds",    inStock:true,  featured:true,  discount:0,  rating:4.8 },
    { title:"Ergonomic Office Table", description:"Spacious desk for productivity and long hours.",          price:12500, image:"https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=600&h=600", category:"tables",  inStock:true,  featured:false, discount:0,  rating:4.5 },
    { title:"Spacious Wardrobe",      description:"Large multi-compartment wardrobe with ample storage.",    price:28000, image:"https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=80&w=600&h=600", category:"storage", inStock:true,  featured:false, discount:0,  rating:4.6 },
    { title:"Glass Coffee Table",     description:"Minimalist center table for modern living spaces.",       price:8500,  image:"https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600&h=600", category:"tables",  inStock:true,  featured:false, discount:15, rating:4.3 },
    { title:"Tall Bookshelf",         description:"Five-tier shelf for books and decorative pieces.",        price:10500, image:"https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=600&h=600", category:"storage", inStock:true,  featured:false, discount:0,  rating:4.4 },
    { title:"Modern TV Unit",         description:"Sleek entertainment center with cable management.",       price:15000, image:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600&h=600", category:"storage", inStock:true,  featured:true,  discount:0,  rating:4.7 },
    { title:"Dining Chair Set",       description:"Set of 4 ergonomic dining chairs with backrests.",       price:12000, image:"https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=600&h=600", category:"chairs",  inStock:true,  featured:false, discount:5,  rating:4.5 },
    { title:"Executive Office Chair", description:"Adjustable executive chair with lumbar support.",        price:9500,  image:"https://images.unsplash.com/photo-1505751104546-4b63a761eb3e?auto=format&fit=crop&q=80&w=600&h=600", category:"chairs",  inStock:true,  featured:false, discount:0,  rating:4.6 },
    { title:"Minimalist Nightstand",  description:"Compact bedside table with drawer and open shelf.",      price:4500,  image:"https://images.unsplash.com/photo-1532372576444-ea95f036c196?auto=format&fit=crop&q=80&w=600&h=600", category:"tables",  inStock:true,  featured:false, discount:0,  rating:4.2 },
  ];

  for (const p of products) {
    await safe(`Product: ${p.title}`, () =>
      db.createDocument(DATABASE_ID, "products", "unique()", p, [
        Permission.read(Role.any()),
      ])
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Users Collection
// ─────────────────────────────────────────────────────────────────────────────
async function setupUsers() {
  console.log("\n👤 Setting up 'users' collection...");

  await safe("Create collection", () =>
    db.createCollection(DATABASE_ID, "users", "Users", [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.label("admin")),
    ])
  );

  const attrs = [
    () => db.createStringAttribute(DATABASE_ID, "users", "authId",  100,  true),
    () => db.createStringAttribute(DATABASE_ID, "users", "name",    255,  true),
    () => db.createStringAttribute(DATABASE_ID, "users", "email",   320,  true),
    () => db.createStringAttribute(DATABASE_ID, "users", "phone",   20,   false, ""),
    () => db.createStringAttribute(DATABASE_ID, "users", "avatar",  2000, false, ""),
    () => db.createStringAttribute(DATABASE_ID, "users", "address", 500,  false, ""),
    () => db.createStringAttribute(DATABASE_ID, "users", "city",    100,  false, ""),
    () => db.createStringAttribute(DATABASE_ID, "users", "role",    20,   false, "customer"),
  ];
  const names = ["authId","name","email","phone","avatar","address","city","role"];
  for (let i = 0; i < attrs.length; i++) {
    await safe(`Attribute: ${names[i]}`, attrs[i]);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("  ⏳ Waiting 5s for attributes to activate...");
  await new Promise(r => setTimeout(r, 5000));

  await safe("Unique index: authId", () =>
    db.createIndex(DATABASE_ID, "users", "idx_authId", 'unique', ["authId"])
  );
  await safe("Index: email", () =>
    db.createIndex(DATABASE_ID, "users", "idx_email", 'key', ["email"])
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Orders Collection
// ─────────────────────────────────────────────────────────────────────────────
async function setupOrders() {
  console.log("\n📋 Setting up 'orders' collection...");

  await safe("Create collection", () =>
    db.createCollection(DATABASE_ID, "orders", "Orders", [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.label("admin")),
      Permission.delete(Role.label("admin")),
    ])
  );

  const attrs = [
    () => db.createStringAttribute(DATABASE_ID, "orders", "userId",          100,  true),
    () => db.createStringAttribute(DATABASE_ID, "orders", "status",          30,   true,  "pending"),
    () => db.createFloatAttribute( DATABASE_ID, "orders", "totalAmount",     true, 0),
    () => db.createStringAttribute(DATABASE_ID, "orders", "shippingAddress", 500,  true),
    () => db.createStringAttribute(DATABASE_ID, "orders", "shippingCity",    100,  true),
    () => db.createStringAttribute(DATABASE_ID, "orders", "phone",           20,   true),
    () => db.createStringAttribute(DATABASE_ID, "orders", "paymentMethod",   50,   false, "cash"),
    () => db.createStringAttribute(DATABASE_ID, "orders", "note",            500,  false, ""),
  ];
  const names = ["userId","status","totalAmount","shippingAddress","shippingCity","phone","paymentMethod","note"];
  for (let i = 0; i < attrs.length; i++) {
    await safe(`Attribute: ${names[i]}`, attrs[i]);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("  ⏳ Waiting 5s for attributes to activate...");
  await new Promise(r => setTimeout(r, 5000));

  await safe("Index: userId", () =>
    db.createIndex(DATABASE_ID, "orders", "idx_userId", 'key', ["userId"])
  );
  await safe("Index: status", () =>
    db.createIndex(DATABASE_ID, "orders", "idx_status", 'key', ["status"])
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Order Items Collection
// ─────────────────────────────────────────────────────────────────────────────
async function setupOrderItems() {
  console.log("\n📦 Setting up 'order_items' collection...");

  await safe("Create collection", () =>
    db.createCollection(DATABASE_ID, "order_items", "Order Items", [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.label("admin")),
      Permission.delete(Role.label("admin")),
    ])
  );

  const attrs = [
    () => db.createStringAttribute( DATABASE_ID, "order_items", "orderId",   100,  true),
    () => db.createStringAttribute( DATABASE_ID, "order_items", "productId", 100,  true),
    () => db.createStringAttribute( DATABASE_ID, "order_items", "title",     255,  true),
    () => db.createFloatAttribute(  DATABASE_ID, "order_items", "price",     true, 0),
    () => db.createIntegerAttribute(DATABASE_ID, "order_items", "quantity",  true, 1),
    () => db.createStringAttribute( DATABASE_ID, "order_items", "image",     2000, false, ""),
  ];
  const names = ["orderId","productId","title","price","quantity","image"];
  for (let i = 0; i < attrs.length; i++) {
    await safe(`Attribute: ${names[i]}`, attrs[i]);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("  ⏳ Waiting 5s for attributes to activate...");
  await new Promise(r => setTimeout(r, 5000));

  await safe("Index: orderId", () =>
    db.createIndex(DATABASE_ID, "order_items", "idx_orderId", 'key', ["orderId"])
  );
  await safe("Index: productId", () =>
    db.createIndex(DATABASE_ID, "order_items", "idx_productId", 'key', ["productId"])
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Cart Collection
// ─────────────────────────────────────────────────────────────────────────────
async function setupCart() {
  console.log("\n🛒 Setting up 'cart' collection...");

  await safe("Create collection", () =>
    db.createCollection(DATABASE_ID, "cart", "Cart", [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ])
  );

  const attrs = [
    () => db.createStringAttribute( DATABASE_ID, "cart", "userId",    100, true),
    () => db.createStringAttribute( DATABASE_ID, "cart", "productId", 100, true),
    () => db.createIntegerAttribute(DATABASE_ID, "cart", "quantity",  true, 1),
  ];
  const names = ["userId","productId","quantity"];
  for (let i = 0; i < attrs.length; i++) {
    await safe(`Attribute: ${names[i]}`, attrs[i]);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("  ⏳ Waiting 5s for attributes to activate...");
  await new Promise(r => setTimeout(r, 5000));

  await safe("Index: userId", () =>
    db.createIndex(DATABASE_ID, "cart", "idx_userId", 'key', ["userId"])
  );
  await safe("Compound: userId+productId", () =>
    db.createIndex(DATABASE_ID, "cart", "idx_user_product", 'key', ["userId", "productId"])
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Reviews Collection
// ─────────────────────────────────────────────────────────────────────────────
async function setupReviews() {
  console.log("\n⭐ Setting up 'reviews' collection...");

  await safe("Create collection", () =>
    db.createCollection(DATABASE_ID, "reviews", "Reviews", [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ])
  );

  const attrs = [
    () => db.createStringAttribute(DATABASE_ID, "reviews", "userId",    100,  true),
    () => db.createStringAttribute(DATABASE_ID, "reviews", "productId", 100,  true),
    () => db.createStringAttribute(DATABASE_ID, "reviews", "userName",  255,  true),
    () => db.createFloatAttribute( DATABASE_ID, "reviews", "rating",    true, 0, 0, 5),
    () => db.createStringAttribute(DATABASE_ID, "reviews", "comment",   2000, false, ""),
  ];
  const names = ["userId","productId","userName","rating","comment"];
  for (let i = 0; i < attrs.length; i++) {
    await safe(`Attribute: ${names[i]}`, attrs[i]);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("  ⏳ Waiting 5s for attributes to activate...");
  await new Promise(r => setTimeout(r, 5000));

  await safe("Index: productId", () =>
    db.createIndex(DATABASE_ID, "reviews", "idx_productId", 'key', ["productId"])
  );
  await safe("Index: userId", () =>
    db.createIndex(DATABASE_ID, "reviews", "idx_userId", 'key', ["userId"])
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. Wishlist Collection
// ─────────────────────────────────────────────────────────────────────────────
async function setupWishlist() {
  console.log("\n❤️ Setting up 'wishlist' collection...");

  await safe("Create collection", () =>
    db.createCollection(DATABASE_ID, "wishlist", "Wishlist", [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ])
  );

  const attrs = [
    () => db.createStringAttribute(DATABASE_ID, "wishlist", "userId",    100, true),
    () => db.createStringAttribute(DATABASE_ID, "wishlist", "productId", 100, true),
  ];
  const names = ["userId","productId"];
  for (let i = 0; i < attrs.length; i++) {
    await safe(`Attribute: ${names[i]}`, attrs[i]);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("  ⏳ Waiting 5s for attributes to activate...");
  await new Promise(r => setTimeout(r, 5000));

  await safe("Index: userId", () =>
    db.createIndex(DATABASE_ID, "wishlist", "idx_userId", 'key', ["userId"])
  );
  await safe("Compound: userId+productId", () =>
    db.createIndex(DATABASE_ID, "wishlist", "idx_user_product", 'key', ["userId", "productId"])
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 Sabhe Furniture – Appwrite Database Setup");
  console.log("=".repeat(50));

  // Verify or create DB
  try {
    await db.get(DATABASE_ID);
    console.log(`✅ Database '${DATABASE_ID}' found.`);
  } catch {
    console.log(`📝 Database '${DATABASE_ID}' not found — creating it...`);
    await db.create(DATABASE_ID, "Sabhe Furniture");
    console.log(`✅ Database '${DATABASE_ID}' created.`);
  }

  await setupCategories();
  await setupProducts();
  await setupUsers();
  await setupOrders();
  await setupOrderItems();
  await setupCart();
  await setupReviews();
  await setupWishlist();
  await setupStorage();
  await seedCategories();
  await seedProducts();

  console.log("\n" + "=".repeat(50));
  console.log("✅ Setup complete! Your Appwrite database is ready. (8 collections)");
}

main().catch(console.error);
