import { CreateOrderParams } from "../types/createOrderParams";
import { GiftCardOrder } from "../types/giftCardOrder";

export const capturePayment = async (giftCardOrder: GiftCardOrder, orderDetails: CreateOrderParams) => {
  const response = await fetch("/api/capture-payment", {
    method: "POST",
    body: JSON.stringify({
      publicOrderId: giftCardOrder.publicOrderId,
      ...orderDetails,
    }),
  });

  if (!response.ok) {
    return { error: "Payment cannot be executed, please try again." };
  }

  const data = await response.json();
  console.log("[capturePayment] Response data", data);

  return { giftCardCode: data.giftCardCode };
};
