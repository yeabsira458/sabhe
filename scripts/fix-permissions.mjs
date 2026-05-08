import { Client, Databases, Permission, Role } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("69fad27100189847d507")
  .setKey("standard_aea69da0c8b33fcbfba1746ddc66ec965365224842367a2748059b1a2fd6484f3b51a27d3da6605adad9645f8f86fc5ad8d1048d56bb4ea09aea7d6e5205c9556d4e698ce100ba722b9e6e2a4031029529b5d7bade1bf8534220e94fa4b0da37773bcf10808788b6dbbbf9404e32dc8e11cba3c5f210093dc945eb3490675c34");

const db = new Databases(client);
const DATABASE_ID = "69fad4ec001a1f46c410";

async function main() {
  // 1. List all collections and their permissions
  console.log("=== Current Collections ===");
  const cols = await db.listCollections(DATABASE_ID);
  for (const c of cols.collections) {
    console.log(`\n📁 ${c.name} (${c.$id})`);
    console.log("   Permissions:", JSON.stringify(c.$permissions));
  }

  // 2. Fix the `users` collection permissions
  console.log("\n=== Fixing 'users' collection permissions ===");
  await db.updateCollection(
    DATABASE_ID,
    "users",
    "Users",
    [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.label("admin")),
    ],
    true  // documentSecurity enabled
  );
  console.log("✅ 'users' collection permissions updated!");

  // 3. Fix products and categories to be public readable
  for (const colId of ["products", "categories"]) {
    const col = cols.collections.find(c => c.$id === colId);
    if (!col) {
      console.log(`⚠️  '${colId}' collection not found, skipping`);
      continue;
    }
    await db.updateCollection(
      DATABASE_ID,
      colId,
      col.name,
      [Permission.read(Role.any())],
      true
    );
    console.log(`✅ '${colId}' collection → read:any()`);
  }

  // 4. Verify final state
  console.log("\n=== Verification ===");
  const updated = await db.listCollections(DATABASE_ID);
  for (const c of updated.collections) {
    console.log(`📁 ${c.name} (${c.$id}) → ${JSON.stringify(c.$permissions)}`);
  }

  console.log("\n🎉 All permissions fixed!");
}

main().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
