import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  const { paramsToSign } = await request.json();

  const timestamp = Math.round(new Date().getTime() / 1000);

  // Merge timestamp with any params
  const params = {
    ...paramsToSign,
    timestamp,
  };

  // Create signature
  const signature = crypto
    .createHash("sha1")
    .update(
      Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join("&") + process.env.CLOUDINARY_API_SECRET
    )
    .digest("hex");

  return NextResponse.json({
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}
