import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dfdxbbhqr",
  api_key: "158563879685126",
  api_secret: "SFILXd8cmnaRlvgxxK7dwFrXDsE",
});

async function test() {
  // First test basic upload
  console.log("Step 1: Uploading image to Cloudinary...");
  try {
    const uploadRes = await cloudinary.uploader.upload(
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600&h=800",
      { folder: "sabhe_test", public_id: "test_chair_upload", overwrite: true }
    );
    console.log("✅ Uploaded:", uploadRes.secure_url);
    console.log("   Public ID:", uploadRes.public_id);

    // Step 2: Try the gen_background_replace transformation
    console.log("\nStep 2: Generating Cloudinary AI background URL...");
    const aiUrl = cloudinary.url(uploadRes.public_id, {
      transformation: [
        { effect: "gen_background_replace:prompt_luxury modern living room with warm lighting" }
      ],
      secure: true,
    });
    console.log("✅ AI URL:", aiUrl);

    // Step 3: Actually fetch to see if transformation works
    console.log("\nStep 3: Fetching AI transformed image...");
    const res = await fetch(aiUrl);
    console.log("Status:", res.status, res.statusText);
    if (!res.ok) {
      const text = await res.text();
      console.log("❌ Error response:", text.slice(0, 500));
    } else {
      console.log("✅ AI image generated successfully! Size:", res.headers.get("content-length"), "bytes");
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

test();
