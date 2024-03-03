import { NextRequest, NextResponse } from "next/server";

type Order = {
  jwt_token: string;
  public_order_id: string;
};

export async function POST(req: NextRequest): Promise<Order | Response> {
  const { amount: amountRequested } = await req.json();

  if (!amountRequested) {
    return new Response("Missing amount", { status: 400 });
  }

  const amount = Number.parseInt(amountRequested);

  if (!amount || amount <= 0) {
    return new Response("Amount must be a number larger than 0", { status: 400 });
  }

  const { BOLD_COMMERCE_ACCESS_TOKEN, NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER } = process.env;

  if (!BOLD_COMMERCE_ACCESS_TOKEN || !NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER) {
    return new Response("Missing Bold Commerce configuration", { status: 500 });
  }

  const response = await fetch(
    `https://api.boldcommerce.com/checkout/orders/${NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER}/init`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BOLD_COMMERCE_ACCESS_TOKEN}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        cart_items: [
          {
            id: "123",
            quantity: 1,
            title: "Voucherify Gift Card",
            variant_title: "Gift Card",
            requires_shipping: false,
            price: amount * 10,
            weight: 0,
            line_item_key: "ABC123",
            taxable: false,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    return new Response("Impossible to init order, please try again later.", { status: 400 });
  }

  const { data } = await response.json();

  console.log("[API][GIFT_CARD][initializeOrder] Order intialized, response:", data);
  return NextResponse.json({ jwt: data.jwt_token, publicOrderId: data.public_order_id });
}
