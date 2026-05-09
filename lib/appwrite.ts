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
export const PRODUCTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;
export const CATEGORIES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!; 
export const PRODUCT_IMAGES_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_PRODUCT_IMAGES_BUCKET_ID!;
export const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;
export const ORDERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!;
export const ORDER_ITEMS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ORDER_ITEMS_COLLECTION_ID!;
export const CART_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CART_COLLECTION_ID!;
export const REVIEWS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID!;
export const WISHLIST_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_WISHLIST_COLLECTION_ID!;

// ─── Types ──────────────────────────────────────────────────────────────────
export interface AppwriteProduct {
  $id: string;
  productName: string; // required
  description: string; // required
  price: number;       // required
  image: string;       // required — URL from storage bucket 69fddb13000e96d29eac
  category: string;    // required — must match slug from categories collection
  featured: boolean;   // required
  inStock: boolean;
  discount: number;
  rating: number;
}

export interface AppwriteCategory {
  $id: string;
  categoryName: string;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
  priorityLevel?: number | null;
  displayOrder?: number | null;
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