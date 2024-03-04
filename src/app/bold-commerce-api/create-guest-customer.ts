import { GiftCardOrder } from "../types/giftCardOrder";

export const createGuestCustomer = async (
  giftCardOrder: GiftCardOrder,
  firstName: string,
  lastName: string,
  email: string
) => {
  const response = await fetch(
    `https://api.boldcommerce.com/checkout/storefront/${process.env.NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER}/${giftCardOrder?.publicOrderId}/customer/guest`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${giftCardOrder?.jwt}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email_address: email,
        accepts_marketing: false,
      }),
    }
  );

  const data = await response.json();
  console.log("[setShippingLineMethod] Response data", data);

  return data;
};
