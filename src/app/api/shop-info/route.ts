import { NextResponse } from "next/server";

export async function GET() {
  const { BOLD_COMMERCE_ACCESS_TOKEN, BOLD_COMMERCE_SHARED_SECRET } = process.env;

  if (!BOLD_COMMERCE_ACCESS_TOKEN || !BOLD_COMMERCE_SHARED_SECRET) {
    return new Response("Missing Bold Commerce configuration", { status: 500 });
  }

  const response = await fetch(`https://api.boldcommerce.com/shops/v1/info`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${BOLD_COMMERCE_ACCESS_TOKEN}`,
      "Content-type": "application/json",
    },
  });

  console.log(`[API][GIFT_CARD][getShopInfo] Response status ${response.status}`);

  const data = await response.json();

  console.log("[API][GIFT_CARD][getShopInfo] Response:", data);
  return NextResponse.json({ data });
}
