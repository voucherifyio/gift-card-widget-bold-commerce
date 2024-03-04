import { GiftCardOrder } from "../types/giftCardOrder";

export const setShippingLineMethod = async (giftCardOrder: GiftCardOrder) => {
  const response = await fetch(
    `https://api.boldcommerce.com/checkout/storefront/${process.env.NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER}/${giftCardOrder?.publicOrderId}/shipping_lines`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${giftCardOrder?.jwt}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        index: "0",
      }),
    }
  );

  const data = await response.json();
  console.log("[setShippingLineMethod] Response data", data);

  return data;
};
