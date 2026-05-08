import {
  Client,
  Databases,
  Account,
  Storage,
  ID,
  Query,
  Permission,
  Role,
} from "appwrite";

// ─── Client ─────────────────────────────────────────────────────────────────
// Next.js automatically loads .env.local — no dotenv import needed.
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account   = new Account(client);
export const databases = new Databases(client);
export const storage   = new Storage(client);

// ─── Constants ──────────────────────────────────────────────────────────────
export const DATABASE_ID            = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const PRODUCTS_COLLECTION_ID    = "products";
export const CATEGORIES_COLLECTION_ID  = "catagories"; // matches actual Appwrite collection ID
export const PRODUCT_IMAGES_BUCKET_ID  = "product_images";
export const USERS_COLLECTION_ID       = "users";
export const ORDERS_COLLECTION_ID      = "orders";
export const ORDER_ITEMS_COLLECTION_ID = "order_items";
export const CART_COLLECTION_ID        = "cart";
export const REVIEWS_COLLECTION_ID     = "reviews";
export const WISHLIST_COLLECTION_ID    = "wishlist";

// ─── Types ───────────────────────────────────────────────────────────────────
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

export interface AppwriteOrder {
  $id: string;
  $createdAt: string;
  userId: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  totalAmount: number;
  shippingAddress: string;
  shippingCity: string;
  phone: string;
  paymentMethod: "cash" | "telebirr" | "cbe" | "abyssinia";
  note: string;
}

export interface AppwriteOrderItem {
  $id: string;
  orderId: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface AppwriteCartItem {
  $id: string;
  userId: string;
  productId: string;
  quantity: number;
}

export interface AppwriteReview {
  $id: string;
  $createdAt: string;
  userId: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
}

export interface AppwriteWishlistItem {
  $id: string;
  userId: string;
  productId: string;
}

// ─── Products ────────────────────────────────────────────────────────────────
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

// ─── Auth ────────────────────────────────────────────────────────────────────
export async function getCurrentUser() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

// ─── User Profiles ───────────────────────────────────────────────────────────
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

/**
 * Creates a user profile document in the `users` collection.
 * Grants the authenticated user read/update access to their own document.
 */
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
    const doc = await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      ID.unique(),
      {
        authId:  data.authId,
        name:    data.name,
        email:   data.email,
        phone:   data.phone   || "",
        avatar:  data.avatar  || "",
        address: data.address || "",
        city:    data.city    || "",
        role:    "customer",
      },
      [
        Permission.read(Role.user(data.authId)),
        Permission.update(Role.user(data.authId)),
      ]
    );
    return doc as unknown as AppwriteUser;
  } catch (error) {
    console.error("createUserProfile error:", error);
    throw error; // re-throw so the caller (AuthSync) can log it
  }
}

export async function updateUserProfile(
  docId: string,
  data: Partial<Omit<AppwriteUser, "$id" | "authId" | "role">>
): Promise<AppwriteUser | null> {
  try {
    const doc = await databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, docId, data);
    return doc as unknown as AppwriteUser;
  } catch (error) {
    console.error("updateUserProfile error:", error);
    return null;
  }
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export async function getCartItems(userId: string): Promise<AppwriteCartItem[]> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, CART_COLLECTION_ID, [
      Query.equal("userId", userId),
      Query.limit(100),
    ]);
    return res.documents as unknown as AppwriteCartItem[];
  } catch (error) {
    console.error("getCartItems error:", error);
    return [];
  }
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity = 1
): Promise<AppwriteCartItem | null> {
  try {
    const existing = await databases.listDocuments(DATABASE_ID, CART_COLLECTION_ID, [
      Query.equal("userId", userId),
      Query.equal("productId", productId),
      Query.limit(1),
    ]);
    if (existing.documents.length > 0) {
      const doc = existing.documents[0];
      const updated = await databases.updateDocument(DATABASE_ID, CART_COLLECTION_ID, doc.$id, {
        quantity: (doc as unknown as AppwriteCartItem).quantity + quantity,
      });
      return updated as unknown as AppwriteCartItem;
    }
    const doc = await databases.createDocument(DATABASE_ID, CART_COLLECTION_ID, ID.unique(), {
      userId, productId, quantity,
    });
    return doc as unknown as AppwriteCartItem;
  } catch (error) {
    console.error("addToCart error:", error);
    return null;
  }
}

export async function updateCartItem(docId: string, quantity: number): Promise<AppwriteCartItem | null> {
  try {
    const doc = await databases.updateDocument(DATABASE_ID, CART_COLLECTION_ID, docId, { quantity });
    return doc as unknown as AppwriteCartItem;
  } catch (error) {
    console.error("updateCartItem error:", error);
    return null;
  }
}

export async function removeFromCart(docId: string): Promise<boolean> {
  try {
    await databases.deleteDocument(DATABASE_ID, CART_COLLECTION_ID, docId);
    return true;
  } catch (error) {
    console.error("removeFromCart error:", error);
    return false;
  }
}

// ─── Orders ──────────────────────────────────────────────────────────────────
export async function createOrder(data: {
  userId: string;
  totalAmount: number;
  shippingAddress: string;
  shippingCity: string;
  phone: string;
  paymentMethod?: string;
  note?: string;
}): Promise<AppwriteOrder | null> {
  try {
    const doc = await databases.createDocument(DATABASE_ID, ORDERS_COLLECTION_ID, ID.unique(), {
      ...data,
      status: "pending",
      paymentMethod: data.paymentMethod || "cash",
      note: data.note || "",
    });
    return doc as unknown as AppwriteOrder;
  } catch (error) {
    console.error("createOrder error:", error);
    return null;
  }
}

export async function getUserOrders(userId: string): Promise<AppwriteOrder[]> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID, [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
      Query.limit(50),
    ]);
    return res.documents as unknown as AppwriteOrder[];
  } catch (error) {
    console.error("getUserOrders error:", error);
    return [];
  }
}

export async function createOrderItem(data: {
  orderId: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}): Promise<AppwriteOrderItem | null> {
  try {
    const doc = await databases.createDocument(DATABASE_ID, ORDER_ITEMS_COLLECTION_ID, ID.unique(), {
      ...data,
      image: data.image || "",
    });
    return doc as unknown as AppwriteOrderItem;
  } catch (error) {
    console.error("createOrderItem error:", error);
    return null;
  }
}

export async function getOrderItems(orderId: string): Promise<AppwriteOrderItem[]> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, ORDER_ITEMS_COLLECTION_ID, [
      Query.equal("orderId", orderId),
      Query.limit(100),
    ]);
    return res.documents as unknown as AppwriteOrderItem[];
  } catch (error) {
    console.error("getOrderItems error:", error);
    return [];
  }
}

// ─── Reviews ─────────────────────────────────────────────────────────────────
export async function getProductReviews(productId: string): Promise<AppwriteReview[]> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, REVIEWS_COLLECTION_ID, [
      Query.equal("productId", productId),
      Query.orderDesc("$createdAt"),
      Query.limit(50),
    ]);
    return res.documents as unknown as AppwriteReview[];
  } catch (error) {
    console.error("getProductReviews error:", error);
    return [];
  }
}

export async function createReview(data: {
  userId: string;
  productId: string;
  userName: string;
  rating: number;
  comment?: string;
}): Promise<AppwriteReview | null> {
  try {
    const doc = await databases.createDocument(DATABASE_ID, REVIEWS_COLLECTION_ID, ID.unique(), {
      ...data,
      comment: data.comment || "",
    });
    return doc as unknown as AppwriteReview;
  } catch (error) {
    console.error("createReview error:", error);
    return null;
  }
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export async function getWishlist(userId: string): Promise<AppwriteWishlistItem[]> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, WISHLIST_COLLECTION_ID, [
      Query.equal("userId", userId),
      Query.limit(100),
    ]);
    return res.documents as unknown as AppwriteWishlistItem[];
  } catch (error) {
    console.error("getWishlist error:", error);
    return [];
  }
}

export async function toggleWishlist(
  userId: string,
  productId: string
): Promise<{ added: boolean }> {
  try {
    const existing = await databases.listDocuments(DATABASE_ID, WISHLIST_COLLECTION_ID, [
      Query.equal("userId", userId),
      Query.equal("productId", productId),
      Query.limit(1),
    ]);
    if (existing.documents.length > 0) {
      await databases.deleteDocument(DATABASE_ID, WISHLIST_COLLECTION_ID, existing.documents[0].$id);
      return { added: false };
    }
    await databases.createDocument(DATABASE_ID, WISHLIST_COLLECTION_ID, ID.unique(), {
      userId, productId,
    });
    return { added: true };
  } catch (error) {
    console.error("toggleWishlist error:", error);
    return { added: false };
  }
}

export { ID, Query };