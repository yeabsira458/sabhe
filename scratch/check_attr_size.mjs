import { Client, Databases } from "node-appwrite";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY || "standard_aea69da0c8b33fcbfba1746ddc66ec965365224842367a2748059b1a2fd6484f3b51a27d3da6605adad9645f8f86fc5ad8d1048d56bb4ea09aea7d6e5205c9556d4e698ce100ba722b9e6e2a4031029529b5d7bade1bf8534220e94fa4b0da37773bcf10808788b6dbbbf9404e32dc8e11cba3c5f210093dc945eb3490675c34");

const db = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID;

async function check() {
  try {
    const attr = await db.getAttribute(DATABASE_ID, COLLECTION_ID, "image");
    console.log("Image attribute size:", attr.size);
  } catch (err) {
    console.error(err.message);
  }
}

check();
