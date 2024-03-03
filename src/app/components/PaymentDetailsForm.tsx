import { Flex, Heading } from "@chakra-ui/react";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { GiftCardOrder } from "../types/giftCardOrder";

type PaymentDetailsFormProps = {
  setLoading: Dispatch<SetStateAction<boolean>>;
  setPaymentMethodAdding: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  paymentMethodAdding: boolean;
  handleFinalizeOrder: () => void;
  giftCardOrder: GiftCardOrder | null;
};

const PaymentDetailsForm: FC<PaymentDetailsFormProps> = ({
  setLoading,
  setPaymentMethodAdding,
  loading,
  paymentMethodAdding,
  handleFinalizeOrder,
  giftCardOrder,
}) => {
  const [pigiIframeHeight, setPigiIframeHeight] = useState<number>(100);

  useEffect(() => {
    const handler = async ({ data }: any) => {
      console.log("PIGI incoming event", data);
      if (data.type === "PAYMENT_GATEWAY_FRAME_INITIALIZED") {
        setPigiIframeHeight(data.height);
      }
      if (data.type === "PAYMENT_GATEWAY_FRAME_HEIGHT_UPDATED") {
        setLoading(false);
        setPigiIframeHeight(data.height);
      }
      if (data.responseType === "PIGI_ADD_PAYMENT" && data.payload.success === false) {
        setPaymentMethodAdding(false);
      }
      if (data.responseType === "PIGI_ADD_PAYMENT" && data.payload.success === true) {
        handleFinalizeOrder();
      }
    };
    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
    };
  });

  const addPaymentMethod = () => {
    setLoading(true);
    setPaymentMethodAdding(true);
    const iframeElement: HTMLIFrameElement | null = document.querySelector("iframe#PIGI");
    if (!iframeElement) {
      throw new Error("Could not found the iframe");
    }
    const iframeWindow = iframeElement.contentWindow;
    if (!iframeWindow) {
      throw new Error("Could not found the iframe window");
    }
    const action = { actionType: "PIGI_ADD_PAYMENT" };
    iframeWindow.postMessage(action, "*");
  };

  if (giftCardOrder?.jwt)
    return (
      <Flex h="100%" direction={{ base: "column" }} gap="30px" alignItems="center" justifyContent="center">
        <Heading fontSize={"1.5em"} alignSelf="flex-start">
          Choose payment method
        </Heading>
        <iframe
          id="PIGI"
          style={{
            width: "100%",
            height: `${pigiIframeHeight}px`,
            opacity: loading ? 0 : 1,
          }}
          src={`https://api.boldcommerce.com/checkout/storefront/${process.env.NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER}/${giftCardOrder?.publicOrderId}/payments/iframe?token=${giftCardOrder.jwt}`}
        />
        <button
          disabled={paymentMethodAdding}
          onClick={addPaymentMethod}
          style={{
            backgroundColor: "#5059F6",
            borderRadius: "6px",
            height: "46px",
            width: "150px",
            margin: "auto",
            color: "#FFF",
            fontSize: "18px",
            fontWeight: "800",
            opacity: loading ? 0 : 1,
          }}
        >
          Order
        </button>
      </Flex>
    );
};

export default PaymentDetailsForm;
