import { Client, Databases, Account, Storage, ID, Query } from "appwrite";

// ─── Client ────────────────────────────────────────────────────────────────
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// ─── Constants ─────────────────────────────────────────────────────────────
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const PRODUCTS_COLLECTION_ID = "products";
export const CATEGORIES_COLLECTION_ID = "catagories"; // matches actual collection ID
export const PRODUCT_IMAGES_BUCKET_ID = "product_images";
export const USERS_COLLECTION_ID = "users";
export const ORDERS_COLLECTION_ID = "orders";
export const ORDER_ITEMS_COLLECTION_ID = "order_items";
export const CART_COLLECTION_ID = "cart";
export const REVIEWS_COLLECTION_ID = "reviews";
export const WISHLIST_COLLECTION_ID = "wishlist";

// ─── Types ──────────────────────────────────────────────────────────────────
export interface AppwriteProduct {
  $id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  discount: number;
  rating: number;
}

export interface AppwriteCategory {
  $id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface AppwriteUser {
  $id: string;
  authId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  city: string;
  role: "customer" | "admin";
}

// ─── Products ───────────────────────────────────────────────────────────────
export async function getProducts(categorySlug?: string): Promise<AppwriteProduct[]> {
  try {
    const queries: string[] = [Query.limit(100)];
    if (categorySlug && categorySlug !== "all") {
      queries.push(Query.equal("category", categorySlug));
    }
    const res = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION_ID, queries);
    return res.documents as unknown as AppwriteProduct[];
  } catch (error) {
    console.error("getProducts error:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<AppwriteProduct | null> {
  try {
    const doc = await databases.getDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, id);
    return doc as unknown as AppwriteProduct;
  } catch (error) {
    console.error("getProductById error:", error);
    return null;
  }
}

export async function getFeaturedProducts(): Promise<AppwriteProduct[]> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION_ID, [
      Query.equal("featured", true),
      Query.limit(8),
    ]);
    return res.documents as unknown as AppwriteProduct[];
  } catch (error) {
    console.error("getFeaturedProducts error:", error);
    return [];
  }
}

// ─── Categories ──────────────────────────────────────────────────────────────
export async function getCategories(): Promise<AppwriteCategory[]> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION_ID, [
      Query.limit(50),
    ]);
    return res.documents as unknown as AppwriteCategory[];
  } catch (error) {
    console.error("getCategories error:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<AppwriteCategory | null> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION_ID, [
      Query.equal("slug", slug),
      Query.limit(1),
    ]);
    if (res.documents.length === 0) return null;
    return res.documents[0] as unknown as AppwriteCategory;
  } catch (error) {
    console.error("getCategoryBySlug error:", error);
    return null;
  }
}

// ─── User Profiles & Sync ──────────────────────────────────────────────────
export async function getUserProfile(authId: string): Promise<AppwriteUser | null> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
      Query.equal("authId", authId),
      Query.limit(1),
    ]);
    if (res.documents.length === 0) return null;
    return res.documents[0] as unknown as AppwriteUser;
  } catch (error) {
    console.error("getUserProfile error:", error);
    return null;
  }
}

export async function createUserProfile(data: {
  authId: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
  city?: string;
}): Promise<AppwriteUser | null> {
  try {
    const doc = await databases.createDocument(DATABASE_ID, USERS_COLLECTION_ID, ID.unique(), {
      ...data,
      phone: data.phone || "",
      avatar: data.avatar || "",
      address: data.address || "",
      city: data.city || "",
      role: "customer",
    });
    return doc as unknown as AppwriteUser;
  } catch (error) {
    console.error("createUserProfile error:", error);
    return null;
  }
}

export { ID, Query };