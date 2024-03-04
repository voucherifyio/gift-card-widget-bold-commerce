import { GiftCardOrder } from "../types/giftCardOrder";

export const generateTaxes = async (giftCardOrder: GiftCardOrder) => {
  const response = await fetch(
    `https://api.boldcommerce.com/checkout/storefront/${process.env.NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER}/${giftCardOrder?.publicOrderId}/taxes`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${giftCardOrder?.jwt}`,
        "Content-type": "application/json",
      },
    }
  );

  const data = await response.json();
  console.log("[setShippingLineMethod] Response data", data);

  return data;
};
