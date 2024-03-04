import { GiftCardOrder } from "../types/giftCardOrder";

const address = {
  country_code: "PL",
  country: "Poland",
};

export const setBillingAddress = async (giftCardOrder: GiftCardOrder) => {
  const response = await fetch(
    `https://api.boldcommerce.com/checkout/storefront/${process.env.NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER}/${giftCardOrder?.publicOrderId}/addresses/billing`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${giftCardOrder?.jwt}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        ...address,
      }),
    }
  );

  const data = await response.json();
  console.log("[setShippingLineMethod] Response data", data);

  return data;
};
