import { Dispatch, FC, SetStateAction } from "react";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { Box, Flex, Text } from "@chakra-ui/react";

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  amount: number;
};

type CustomerFormProps = {
  giftCardAmount: number | undefined;
  setGiftCardAmount: Dispatch<SetStateAction<number | undefined>>;
  onSubmit: SubmitHandler<Inputs>;
};

const CustomerForm: FC<CustomerFormProps> = ({ giftCardAmount, setGiftCardAmount, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useFormContext<Inputs>();

  const giftCardAmountOptions: number[] = [50, 100, 150, 300];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
        maxWidth: "790px",
        border: "1px solid #EAEAEA",
        padding: "32px 90px 32px 24px",
      }}
    >
      <Text fontSize="24px" lineHeight="28.8px" fontWeight="900" textTransform="uppercase">
        Customize your e-gift card
      </Text>
      <Text fontSize="20" fontWeight="900" lineHeight="24px">
        1. Amount & quantity – give someone the perfect gift!
      </Text>
      <Box cursor="pointer">
        <Flex gap="15.5px">
          {giftCardAmountOptions.map((amount, index) => (
            <Text
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="150px"
              height="40px"
              borderRadius="4px"
              border={giftCardAmount === amount ? "2px solid #282635" : "1px solid #C0C0C0"}
              key={index}
              onClick={() => {
                setGiftCardAmount(amount);
                register("amount", { required: true });
                setValue("amount", amount * 10);
              }}
            >
              ${amount}
            </Text>
          ))}
        </Flex>
        {errors.amount ? (
          <Text fontSize="12px" fontWeight="500" marginTop="5px" color="#e20f0f">
            {errors.amount.message}
          </Text>
        ) : null}
      </Box>
      <Text fontSize="20" fontWeight="900" lineHeight="24px">
        2. Who will you gift to?
      </Text>
      <Flex gap="16px" w={{ base: "full" }}>
        <Flex direction={{ base: "column" }} w={{ base: "full" }}>
          <label
            style={{
              fontWeight: "800",
              fontSize: "14px",
              lineHeight: "16.8px",
              marginBottom: "8px",
            }}
            htmlFor="firstName"
          >
            Receiver First Name
          </label>
          <input
            defaultValue=""
            {...register("firstName", {
              required: "First name is required",
            })}
            style={{
              borderRadius: "6px",
              border: "1px solid #C0C0C0",
              paddingLeft: "5px",
              fontSize: "14px",
              height: "40px",
            }}
            aria-invalid={errors.firstName ? "true" : "false"}
          />
          {errors.firstName ? (
            <Text fontSize="12px" fontWeight="500" marginTop="5px" color="#e20f0f">
              {errors.firstName.message}
            </Text>
          ) : null}
        </Flex>
        <Flex direction={{ base: "column" }} w={{ base: "full" }}>
          <label
            style={{
              fontWeight: "800",
              fontSize: "14px",
              lineHeight: "16.8px",
              marginBottom: "8px",
            }}
            htmlFor="lastName"
          >
            Receiver Last Name
          </label>
          <input
            defaultValue=""
            {...register("lastName", {
              required: "Last name is required",
            })}
            style={{
              borderRadius: "6px",
              border: "1px solid #C0C0C0",
              paddingLeft: "5px",
              fontSize: "14px",
              height: "40px",
            }}
            aria-invalid={errors.lastName ? "true" : "false"}
          />
          {errors.lastName ? (
            <Text fontSize="12px" fontWeight="500" marginTop="5px" color="#e20f0f">
              {errors.lastName.message}
            </Text>
          ) : null}
        </Flex>
      </Flex>
      <Flex direction={{ base: "column" }}>
        <label
          style={{
            fontWeight: "800",
            fontSize: "14px",
            lineHeight: "16.8px",
            marginBottom: "8px",
          }}
          htmlFor="email"
        >
          Receiver E-mail
        </label>
        <input
          defaultValue=""
          {...register("email", {
            required: "E-mail is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "The e-mail is not valid",
            },
          })}
          style={{
            borderRadius: "6px",
            border: "1px solid #C0C0C0",
            paddingLeft: "5px",
            fontSize: "14px",
            height: "40px",
          }}
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email ? (
          <Text fontSize="12px" fontWeight="500" marginTop="5px" color="#e20f0f">
            {errors.email.message}
          </Text>
        ) : null}
      </Flex>
      <button
        type="submit"
        style={{
          backgroundColor: "#5059F6",
          borderRadius: "6px",
          height: "46px",
          width: "150px",
          margin: "auto",
          color: "#FFF",
          fontSize: "18px",
          fontWeight: "800",
        }}
      >
        Order
      </button>
    </form>
  );
};

export default CustomerForm;
