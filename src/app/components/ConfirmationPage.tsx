import { Flex, Text, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { FC } from "react";
import { useFormContext } from "react-hook-form";

type ConfirmationPageProps = {
  generatedGiftCard: string | undefined;
};

const ConfirmationPage: FC<ConfirmationPageProps> = ({ generatedGiftCard }) => {
  const { getValues } = useFormContext();

  return (
    <Flex
      direction={{ base: "column" }}
      justifyContent="center"
      alignItems="center"
      gap="28px"
      padding="64px 100px"
      backgroundColor="#F4F4F4"
    >
      <Text textAlign="center" fontWeight="900" fontSize="28px" lineHeight="33.6px">
        Thank you for your order! <br /> Your Gift Card Purchase is Complete
      </Text>
      <Text lineHeight="24px">
        We&apos;re thrilled to confirm that your gift card purchase has been successfully processed.{" "}
      </Text>
      <Text textAlign="center" fontWeight="900" fontSize="28px" lineHeight="33.6px">
        Gift Card Number:
      </Text>
      <Text
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "6px",
          height: "32px",
          padding: "8px 12px",
          backgroundColor: "#5059F6",
          color: "#FFF",
          fontWeight: "800",
        }}
      >
        {generatedGiftCard}
      </Text>
      <Text textAlign="center" fontWeight="900" fontSize="28px" lineHeight="33.6px">
        Here&apos;s what happens next:
      </Text>
      <Flex direction={{ base: "column" }} justifyContent="center">
        <Text>
          <span style={{ fontWeight: "900" }}>Recipient Notification:</span> An email with the gift card and your
          personal message (if provided) is on its way to the lucky recipient,{" "}
          {`${getValues().firstName} ${getValues().lastName}`}.
        </Text>
        <Text>
          <span style={{ fontWeight: "900" }}>Instant Joy:</span> The recipient can start shopping on the website right
          away using their gift card.
        </Text>
        <Text>
          <span style={{ fontWeight: "900" }}>Keep Track:</span> You&apos;ll receive a confirmation email shortly,
          outlining your purchase details for your records.
        </Text>
        <NextLink style={{ alignSelf: "center" }} href="/category/accessories">
          <Button width="fit-content" margin="28px" padding="10px 24px" variant="outline">
            Continue Shopping
          </Button>
        </NextLink>
      </Flex>
    </Flex>
  );
};

export default ConfirmationPage;
