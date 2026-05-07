/**
 * Lists all collections and their attributes in the existing database.
 * Run: node scripts/inspect-db.mjs
 */
import { Client, Databases } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("69fad27100189847d507")
  .setKey("standard_aea69da0c8b33fcbfba1746ddc66ec965365224842367a2748059b1a2fd6484f3b51a27d3da6605adad9645f8f86fc5ad8d1048d56bb4ea09aea7d6e5205c9556d4e698ce100ba722b9e6e2a4031029529b5d7bade1bf8534220e94fa4b0da37773bcf10808788b6dbbbf9404e32dc8e11cba3c5f210093dc945eb3490675c34");

const db = new Databases(client);

const dbs = await db.list();
for (const d of dbs.databases) {
  console.log(`\n📦 DB: "${d.$id}" → "${d.name}"`);
  const cols = await db.listCollections(d.$id);
  for (const c of cols.collections) {
    console.log(`\n  📋 Collection: "${c.$id}" → "${c.name}"`);
    const attrs = await db.listAttributes(d.$id, c.$id);
    for (const a of attrs.attributes) {
      const req = a.required ? "✅ required" : "❌ optional";
      console.log(`    - ${a.key} [${a.type}] ${req} default="${a.default ?? ""}"`);
    }
  }
}
