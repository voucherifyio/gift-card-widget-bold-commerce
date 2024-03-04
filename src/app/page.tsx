"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { useCheckout } from "../hooks/use-checkout";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { Box, Flex, Spinner, ChakraProvider } from "@chakra-ui/react";
import CustomerForm from "@/app/components/CustomerForm/CustomerForm";
import PaymentDetailsForm from "./components/PaymentDetailsForm";
import ConfirmationPage from "@/app/components/ConfirmationPage";
import Overview from "@/app/components/Overview";
import ErrorPage from "@/app/components/ErrorPage";

enum FormStage {
  PersonalDataForm,
  PaymentDetailsForm,
  Confirmation,
}

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  amount: number;
};

export default function Home() {
  const { giftCardOrder, finalizeOrder, createOrder } = useCheckout();
  const [giftCardAmount, setGiftCardAmount] = useState<number | undefined>();
  const [generatedGiftCard, setGeneratedGiftCard] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<undefined | string>(undefined);
  const [formStage, setFormStage] = useState<FormStage>(FormStage.PersonalDataForm);
  const [paymentMethodAdding, setPaymentMethodAdding] = useState<boolean>(false);

  const form = useForm<Inputs>();
  const { getValues, setError: setFormError } = form;

  const handleFinalizeOrder = async () => {
    const { giftCardCode, error } = await finalizeOrder(getValues());
    if (error) {
      setGeneratedGiftCard(undefined);
      return setError(error);
    }
    setGeneratedGiftCard(giftCardCode);
    setPaymentMethodAdding(false);
    setLoading(false);
    setFormStage(FormStage.Confirmation);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!data.amount) {
      return setFormError("amount", { message: "Amount is required" });
    }
    setLoading(true);
    await createOrder({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      amount: data.amount,
    });
    setFormStage(FormStage.PaymentDetailsForm);
  };

  if (error) return <ErrorPage errorMessage={error} />;

  return (
    <ChakraProvider>
      <FormProvider {...form}>
        <main className={styles.main}>
          <Flex w="100%" direction={{ base: "column", lg: "row" }} justify={"center"} gap="30px">
            <Box w="100%" position="relative">
              {loading ? (
                <Spinner position="absolute" top="50%" left="calc(50% - 45px)" size="lg" color="#5059F6" />
              ) : null}
              <Box opacity={loading ? "0.3" : "1"} pointerEvents={loading ? "none" : "all"}>
                {formStage === FormStage.PersonalDataForm ? (
                  <CustomerForm
                    giftCardAmount={giftCardAmount}
                    setGiftCardAmount={setGiftCardAmount}
                    onSubmit={onSubmit}
                  />
                ) : null}

                {formStage === FormStage.PaymentDetailsForm && giftCardOrder?.jwt ? (
                  <PaymentDetailsForm
                    loading={loading}
                    paymentMethodAdding={paymentMethodAdding}
                    setLoading={setLoading}
                    setPaymentMethodAdding={setPaymentMethodAdding}
                    handleFinalizeOrder={handleFinalizeOrder}
                    giftCardOrder={giftCardOrder}
                  />
                ) : null}

                {formStage === FormStage.Confirmation ? (
                  <ConfirmationPage generatedGiftCard={generatedGiftCard} />
                ) : null}
              </Box>
            </Box>
            {formStage === FormStage.Confirmation ? null : <Overview giftCardAmount={giftCardAmount} />}
          </Flex>
        </main>
      </FormProvider>
    </ChakraProvider>
  );
}
