import { NextRequest, NextResponse } from "next/server";
import { Client, Databases, ID, Query } from "node-appwrite";

const DATABASE_ID      = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

function getAdminClient() {
  return new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { authId, name, email, phone } = body as {
      authId: string;
      name: string;
      email: string;
      phone: string;
    };

    if (!authId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = new Databases(getAdminClient());

    // Check if profile already exists
    const existing = await db.listDocuments(DATABASE_ID, USERS_COLLECTION, [
      Query.equal("authId", authId),
      Query.limit(1),
    ]);

    if (existing.documents.length > 0) {
      return NextResponse.json({ status: "exists", id: existing.documents[0].$id });
    }

    // Create user profile — matching the ACTUAL Appwrite schema:
    //   Required: name, email, password, role
    //   Optional: phoneNumber, membershipLevel, lastLogin, priority, authId, avatar, address, city
    const doc = await db.createDocument(DATABASE_ID, USERS_COLLECTION, ID.unique(), {
      name:            name || "Sabhe User",
      email:           email,
      password:        "oauth_google",        // placeholder — Google OAuth users don't have a password
      role:            "customer",
      authId:          authId,
      phoneNumber:     phone || "",
      membershipLevel: "basic",
      lastLogin:       new Date().toISOString(),
      priority:        false,
      avatar:          "",
      address:         "",
      city:            "",
    });

    console.log("✅ /api/sync-user: registered →", email);
    return NextResponse.json({ status: "created", id: doc.$id });
  } catch (err) {
    console.error("❌ /api/sync-user error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
