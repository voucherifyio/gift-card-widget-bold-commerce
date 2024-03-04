import { getVoucherify } from "../../../voucherify/voucherify-config";
import { generateGiftCard } from "../../../voucherify/generate-gift-card";
import { NextRequest, NextResponse } from "next/server";

type CreateOrderParams = {
  firstName: string;
  lastName: string;
  email: string;
  amount: number;
};

export async function POST(req: NextRequest) {
  const { publicOrderId, firstName, lastName, email, amount } = await req.json();

  if (!publicOrderId) {
    return new Response("Missing publicOrderId", { status: 400 });
  }

  const { BOLD_COMMERCE_ACCESS_TOKEN, NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER } = process.env;

  if (!BOLD_COMMERCE_ACCESS_TOKEN || !NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER) {
    return new Response("Missing Bold Commerce configuration", { status: 500 });
  }

  const response = await fetch(
    `https://api.boldcommerce.com/checkout/orders/${NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER}/${publicOrderId}/payments/capture/full`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BOLD_COMMERCE_ACCESS_TOKEN}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        reauth: true,
      }),
    }
  );

  const data = await response.json();
  console.log("[API][GIFT_CARD][capturePayment] Order intialized, response:", data);

  const { giftCardCode, error } = await generateGiftCard({
    customer: { firstName, lastName, email, amount },
    voucherify: getVoucherify(),
  });

  if (error) {
    return new Response("Payment cannot be executed, please try again later.", {
      status: 400,
    });
  }

  return NextResponse.json({ giftCardCode });
}
