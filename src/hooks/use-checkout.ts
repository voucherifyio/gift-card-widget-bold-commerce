import { useState } from "react";
import { createGuestCustomer } from "../app/bold-commerce-api/create-guest-customer";
import { generateTaxes } from "../app/bold-commerce-api/generate-taxes";
import { initOrder } from "../app/bold-commerce-api/init-order";
import { processOrder } from "../app/bold-commerce-api/process-order";
import { setBillingAddress } from "../app/bold-commerce-api/set-billing-address";
import { setShippingAddress } from "../app/bold-commerce-api/set-shipping-address";
import { setShippingLineMethod } from "../app/bold-commerce-api/set-shipping-line-method";
import { setPaymentGatewayStyles } from "../app/bold-commerce-api/setPaymentGatewayStyles";
import { capturePayment } from "../app/bold-commerce-api/capture-payments";
import { CreateOrderParams } from "../app/types/createOrderParams";
import { GiftCardOrder } from "../app/types/giftCardOrder";

export const useCheckout = () => {
  const [giftCardOrder, setGiftCardOrder] = useState<GiftCardOrder | null>(null);

  const createOrder = async (orderDetails: CreateOrderParams) => {
    const { publicOrderId, jwt }: GiftCardOrder = await initOrder(orderDetails.amount);
    setGiftCardOrder({ publicOrderId, jwt });
    await setPaymentGatewayStyles({ publicOrderId, jwt });
    await setShippingAddress({ publicOrderId, jwt });
    await setShippingLineMethod({ publicOrderId, jwt });
    await setBillingAddress({ publicOrderId, jwt });
    await generateTaxes({ publicOrderId, jwt });
    await createGuestCustomer(
      { publicOrderId, jwt },
      orderDetails.firstName,
      orderDetails.lastName,
      orderDetails.email
    );
  };

  const finalizeOrder = async (orderDetails: CreateOrderParams) => {
    if (!giftCardOrder?.publicOrderId) {
      throw new Error("You need it create order first");
    }
    await processOrder(giftCardOrder);
    return await capturePayment(giftCardOrder, orderDetails);
  };

  return {
    createOrder,
    finalizeOrder,
    giftCardOrder,
  };
};
