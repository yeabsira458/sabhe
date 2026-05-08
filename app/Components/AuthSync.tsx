"use client";

/**
 * AuthSync — runs silently on every page load.
 * After Google OAuth redirect it calls /api/sync-user (server-side, API-key
 * protected) which registers the user in the Appwrite `users` collection.
 */

import { useEffect } from "react";
import { account } from "../../lib/appwrite";

export default function AuthSync() {
  useEffect(() => {
    async function syncUser() {
      // 1. Check if there is an active session
      let authUser;
      try {
        authUser = await account.get();
      } catch {
        return; // not logged in
      }

      if (!authUser?.$id) return;

      console.log("🔍 AuthSync: session found for", authUser.email);

      // 2. Grab phone stored before OAuth redirect (may be empty string)
      const pendingPhone = sessionStorage.getItem("pending_phone") || "";

      // 3. Call the server-side API route — it uses the Appwrite API key
      //    so it bypasses client-side collection permissions entirely.
      try {
        const res = await fetch("/api/sync-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authId: authUser.$id,
            name:   authUser.name  || "Sabhe User",
            email:  authUser.email || "",
            phone:  pendingPhone,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("❌ AuthSync: API error →", data.error);
          return;
        }

        if (data.status === "created") {
          sessionStorage.removeItem("pending_phone");
          console.log("✅ AuthSync: user registered in DB →", authUser.email);
        } else {
          console.log("ℹ️ AuthSync: profile already exists.");
        }
      } catch (err) {
        console.error("❌ AuthSync: fetch error →", err);
      }
    }

    syncUser();
  }, []);

  return null;
}
