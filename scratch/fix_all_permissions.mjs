import { Client, Databases, Permission, Role } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("69fad27100189847d507")
  .setKey("standard_aea69da0c8b33fcbfba1746ddc66ec965365224842367a2748059b1a2fd6484f3b51a27d3da6605adad9645f8f86fc5ad8d1048d56bb4ea09aea7d6e5205c9556d4e698ce100ba722b9e6e2a4031029529b5d7bade1bf8534220e94fa4b0da37773bcf10808788b6dbbbf9404e32dc8e11cba3c5f210093dc945eb3490675c34");

const db = new Databases(client);
const DATABASE_ID = "69fad4ec001a1f46c410";

async function main() {
  const cols = await db.listCollections(DATABASE_ID);
  
  for (const c of cols.collections) {
    const colId = c.$id;
    // Set permission to allow any user to read/create/update/delete documents client-side.
    // For local development and to avoid client-side session issues, we use Role.any().
    const permissions = [
      Permission.read(Role.any()),
      Permission.create(Role.any()),
      Permission.update(Role.any()),
      Permission.delete(Role.any()),
    ];
    
    console.log(`Updating permissions for ${c.name} (${colId})...`);
    await db.updateCollection(DATABASE_ID, colId, c.name, permissions, false);
    console.log(`✅ Updated ${colId}`);
  }
  
  console.log("\n=== Final verification ===");
  const updated = await db.listCollections(DATABASE_ID);
  for (const c of updated.collections) {
    console.log(`📁 ${c.name} (${c.$id}) -> ${JSON.stringify(c.$permissions)} (security: ${c.documentSecurity})`);
  }
}

main().catch(console.error);
