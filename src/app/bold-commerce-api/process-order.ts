import { GiftCardOrder } from "../types/giftCardOrder";

export const processOrder = async (giftCardOrder: GiftCardOrder) => {
  const response = await fetch(
    `https://api.boldcommerce.com/checkout/storefront/${process.env.NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER}/${giftCardOrder?.publicOrderId}/process_order`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${giftCardOrder?.jwt}`,
        "Content-type": "application/json",
      },
    }
  );

  const data = await response.json();
  console.log("[processOrder] Response data", data);

  return data;
};
