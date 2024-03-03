import { Flex, Text, Box } from "@chakra-ui/react";
import Image from "next/image";
import { FC } from "react";

type OverviewProps = {
  giftCardAmount: number | undefined;
};

const Overview: FC<OverviewProps> = ({ giftCardAmount }) => {
  return (
    <Flex justify={"center"} w={{ base: "full" }} maxW={{ base: "full", md: "400px", xl: "450px" }}>
      <Flex
        direction={{ base: "column" }}
        w={{ base: "full" }}
        maxW="400px"
        height="280px"
        backgroundColor="#F4F4F4"
        padding="32px 24px"
      >
        <Text fontWeight="900" fontSize="24px" color="#282635">
          Overview
        </Text>
        <Box w={{ base: "full" }} position="relative" maxH="150px" height="100%">
          <Image src="gift-card.svg" alt="gift-card-image" fill style={{ objectFit: "contain", maxWidth: "215px" }} />
        </Box>
        <Flex height="35px" justify={"space-between"} alignItems={"flex-end"}>
          <Text fontSize="16px" lineHeight="19.2px" fontWeight="800" color="#282635">
            Order total
          </Text>
          <Text fontSize="16px" lineHeight="19.2px" fontWeight="800" color="#282635">
            ${!giftCardAmount ? "0" : `${giftCardAmount}.00`}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Overview;
