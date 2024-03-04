import { Flex, Text, ChakraProvider, Container } from "@chakra-ui/react";
import { FC } from "react";

type ErrorPageProps = {
  errorMessage: string;
};

const ErrorPage: FC<ErrorPageProps> = ({ errorMessage }) => {
  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={{ base: "4", md: "8" }}>
        <Flex
          direction={{ base: "column" }}
          justifyContent="center"
          alignItems="center"
          gap="28px"
          padding="64px 100px"
          backgroundColor="#F4F4F4"
          w="100%"
          h={{ base: "auto", lg: "300px" }}
        >
          <Text fontWeight="700" fontSize="20px">
            {errorMessage}
          </Text>
        </Flex>
      </Container>
    </ChakraProvider>
  );
};

export default ErrorPage;
