import { GiftCardOrder } from "../types/giftCardOrder";

export const setPaymentGatewayStyles = async (giftCardOrder: GiftCardOrder) => {
  const response = await fetch(
    `https://api.boldcommerce.com/checkout/storefront/${process.env.NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER}/${giftCardOrder.publicOrderId}/payments/styles`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${giftCardOrder.jwt}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        css_rules: [
          {
            cssText: ".PaymentMethods { border: 1px solid #e8e8e8; border-radius: 6px }",
          },
          {
            cssText: ".ToggleField__Input ToggleField__Input--Radio { margin: 0 }",
          },

          {
            cssText: ".TogglePanel__Content { padding: 8px; background-color: #fafafa }",
          },
          {
            cssText:
              ".PaymentMethod--CreditCard__StoredOption .TogglePanel--alt { border: solid 1px #e8e8e8; border-radius: 6px }",
          },
          {
            cssText:
              ".InputField { margin-right: 3px; border: 1px solid #ccc !important; border-radius: 6px !important; padding: 5px; background-color: #FFF !important }",
          },
          {
            cssText: "#credit_card_expiration_date  {max-width: 80px}",
          },
          {
            cssText: "#credit_card_cvv  {max-width: 32px}",
          },
          {
            cssText: ".Field__Label { display: none }",
          },
          {
            cssText: ".CreditCardInfoGroup { display: flex !important; width: 95% !important; margin-left: 15px }",
          },
          {
            cssText:
              ".TogglePanel__Header .Field__InnerWrapper { border-bottom: solid 1px #e8e8e8; padding: 16px 10px !important; background-color: #eaeaf0 }",
          },
          {
            cssText: ".TogglePanel__Header .ToggleField__Text { font-size:20px; font-family: sans-serif; }",
          },
          {
            cssText:
              ".TogglePanel__Content .Field__InnerWrapper { border: none !important; padding: 4px 1px 3px 7px !important; background-color: #fafafa  }",
          },
          {
            cssText: ".TogglePanel__Content .ToggleField__Text { font-size:17px; font-family: sans-serif }",
          },
          {
            cssText:
              ".Field.Field--WithToggleField.Field--SaveShippingAddressToggle.Field--RememberCardToggle .ToggleField__Text { font-size:14px; font-family: sans-serif}",
          },
          {
            cssText:
              ".Message.Message--HasError {margin: 1px 6px 6px 5px; width: fit-content; padding: 0 10px; background: white; border: 1px solid #dfa2a2; border-radius: 6px;}",
          },
          {
            cssText: '.Message__Content p::before {content: "Error: ";}',
          },
          {
            cssText: ".Message__Content p {margin: 4px; font-family: sans-serif; font-size: 14px; color: #dc2626}",
          },
        ],
        media_rules: [],
      }),
    }
  );
  const data = await response.json();
  console.log("[setPaymentGatewayStyles] Response data", data);
  return data;
};
