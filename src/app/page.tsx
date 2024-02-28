"use client"
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { useCheckout } from '../hooks/use-checkout'
import { useForm, SubmitHandler } from 'react-hook-form'
import NextLink from 'next/link'
import Image from 'next/image'
import {
  Box,
  Container,
  Flex,
  Text,
  Spinner,
  Heading,
  Button,
  ChakraProvider
} from '@chakra-ui/react'

enum FormStage {
  PersonalDataForm,
  PaymentDetailsForm,
  Confirmation,
}

type Inputs = {
  firstName: string
  lastName: string
  email: string
  amount: number
}

export default function Home() {
  const { giftCardOrder, createOrder, finalizeOrder } = useCheckout()
  const [giftCardAmount, setGiftCardAmount] = useState<number | undefined>()
  const [generatedGiftCard, setGeneratedGiftCard] = useState<
    string | undefined
  >(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<undefined | string>(undefined)
  const [formStage, setFormStage] = useState<FormStage>(
    FormStage.PersonalDataForm
  )
  const [pigiIframeHeight, setPigiIframeHeight] = useState<number>(100)
  const [paymentMethodAdding, setPaymentMethodAdding] = useState<boolean>(false)


  const addPaymentMethod = () => {
    setLoading(true)
    setPaymentMethodAdding(true)
    const iframeElement: HTMLIFrameElement | null =
      document.querySelector('iframe#PIGI')
    if (!iframeElement) {
      throw new Error('Could not found the iframe')
    }
    const iframeWindow = iframeElement.contentWindow
    if (!iframeWindow) {
      throw new Error('Could not found the iframe window')
    }
    const action = { actionType: 'PIGI_ADD_PAYMENT' }
    iframeWindow.postMessage(action, '*')
  }

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError: setHookFormError,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!data.amount) {
      return setHookFormError('amount', { message: 'Amount is required' })
    }
    setLoading(true)
    await createOrder({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      amount: data.amount,
    })
    setFormStage(FormStage.PaymentDetailsForm)
  }

  const handleFinalizeOrder = async () => {
    const { giftCardCode, error } = await finalizeOrder(getValues())
    if (error) {
      setGeneratedGiftCard(undefined)
      return setError(error)
    }
    setGeneratedGiftCard(giftCardCode)
    setPaymentMethodAdding(false)
    setLoading(false)
    setFormStage(FormStage.Confirmation)
  }

  useEffect(() => {
    const handler = async ({ data }: any) => {
      console.log('PIGI incoming event', data)
      if (data.type === 'PAYMENT_GATEWAY_FRAME_INITIALIZED') {
        setPigiIframeHeight(data.height)
      }
      if (data.type === 'PAYMENT_GATEWAY_FRAME_HEIGHT_UPDATED') {
        setLoading(false)
        setPigiIframeHeight(data.height)
      }
      if (
        data.responseType === 'PIGI_ADD_PAYMENT' &&
        data.payload.success === false
      ) {
        setPaymentMethodAdding(false)
      }
      if (
        data.responseType === 'PIGI_ADD_PAYMENT' &&
        data.payload.success === true
      ) {
        handleFinalizeOrder()
      }
    }
    window.addEventListener('message', handler)
    return () => {
      window.removeEventListener('message', handler)
    }
  }, [giftCardOrder])

  const giftCardAmountOptions: number[] = [50, 100, 150, 300]

  if (error)
    return (
      <ChakraProvider>
        <Container maxW="container.xl" py={{ base: '4', md: '8' }}>
          <Flex
            direction={{ base: 'column' }}
            justifyContent="center"
            alignItems="center"
            gap="28px"
            padding="64px 100px"
            backgroundColor="#F4F4F4"
            w="100%"
            h={{ base: 'auto', lg: '300px' }}
          >
            <Text fontWeight="700" fontSize="20px">
              {error}
            </Text>
          </Flex>
        </Container>
      </ChakraProvider>
    )

  return (
    <ChakraProvider>

      <main className={styles.main}>
        {formStage === FormStage.PersonalDataForm ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              width: '100%',
              maxWidth: '790px',
              border: '1px solid #EAEAEA',
              padding: '32px 90px 32px 24px',
            }}
          >
            <Text
              fontSize="24px"
              lineHeight="28.8px"
              fontWeight="900"
              textTransform="uppercase"
            >
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
                    border={
                      giftCardAmount === amount
                        ? '2px solid #282635'
                        : '1px solid #C0C0C0'
                    }
                    key={index}
                    onClick={() => {
                      setGiftCardAmount(amount)
                      register('amount', { required: true })
                      setValue('amount', amount * 10)
                    }}
                  >
                    ${amount}
                  </Text>
                ))}
              </Flex>
              {errors.amount ? (
                <Text
                  fontSize="12px"
                  fontWeight="500"
                  marginTop="5px"
                  color="#e20f0f"
                >
                  {errors.amount.message}
                </Text>
              ) : null}
            </Box>
            <Text fontSize="20" fontWeight="900" lineHeight="24px">
              2. Who will you gift to?
            </Text>
            <Flex gap="16px" w={{ base: 'full' }}>
              {/* register your input into the hook by invoking the "register" function */}
              <Flex direction={{ base: 'column' }} w={{ base: 'full' }}>
                <label
                  style={{
                    fontWeight: '800',
                    fontSize: '14px',
                    lineHeight: '16.8px',
                    marginBottom: '8px',
                  }}
                  htmlFor="firstName"
                >
                  Receiver First Name
                </label>
                <input
                  defaultValue=""
                  {...register('firstName', {
                    required: 'First name is required',
                  })}
                  style={{
                    borderRadius: '6px',
                    border: '1px solid #C0C0C0',
                    paddingLeft: '5px',
                    fontSize: '14px',
                    height: '40px',
                  }}
                  aria-invalid={errors.firstName ? 'true' : 'false'}
                />
                {errors.firstName ? (
                  <Text
                    fontSize="12px"
                    fontWeight="500"
                    marginTop="5px"
                    color="#e20f0f"
                  >
                    {errors.firstName.message}
                  </Text>
                ) : null}
              </Flex>
              <Flex direction={{ base: 'column' }} w={{ base: 'full' }}>
                <label
                  style={{
                    fontWeight: '800',
                    fontSize: '14px',
                    lineHeight: '16.8px',
                    marginBottom: '8px',
                  }}
                  htmlFor="lastName"
                >
                  Receiver Last Name
                </label>
                <input
                  defaultValue=""
                  {...register('lastName', {
                    required: 'Last name is required',
                  })}
                  style={{
                    borderRadius: '6px',
                    border: '1px solid #C0C0C0',
                    paddingLeft: '5px',
                    fontSize: '14px',
                    height: '40px',
                  }}
                  aria-invalid={errors.lastName ? 'true' : 'false'}
                />
                {errors.lastName ? (
                  <Text
                    fontSize="12px"
                    fontWeight="500"
                    marginTop="5px"
                    color="#e20f0f"
                  >
                    {errors.lastName.message}
                  </Text>
                ) : null}
              </Flex>
            </Flex>
            <Flex direction={{ base: 'column' }}>
              <label
                style={{
                  fontWeight: '800',
                  fontSize: '14px',
                  lineHeight: '16.8px',
                  marginBottom: '8px',
                }}
                htmlFor="email"
              >
                Receiver E-mail
              </label>
              <input
                defaultValue=""
                {...register('email', {
                  required: 'E-mail is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'The e-mail is not valid',
                  },
                })}
                style={{
                  borderRadius: '6px',
                  border: '1px solid #C0C0C0',
                  paddingLeft: '5px',
                  fontSize: '14px',
                  height: '40px',
                }}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email ? (
                <Text
                  fontSize="12px"
                  fontWeight="500"
                  marginTop="5px"
                  color="#e20f0f"
                >
                  {errors.email.message}
                </Text>
              ) : null}
            </Flex>
            <button
              type="submit"
              style={{
                backgroundColor: '#5059F6',
                borderRadius: '6px',
                height: '46px',
                width: '150px',
                margin: 'auto',
                color: '#FFF',
                fontSize: '18px',
                fontWeight: '800',
              }}
            >
              Order
            </button>
          </form>
        ) : null}


        {formStage === FormStage.PaymentDetailsForm && giftCardOrder ? (
          <Flex
            h="100%"
            direction={{ base: 'column' }}
            gap="30px"
            alignItems="center"
            justifyContent="center"
          >
            <Heading fontSize={'1.5em'} alignSelf="flex-start">
              Choose payment method
            </Heading>
            <iframe
              id="PIGI"
              style={{
                width: '100%',
                height: `${pigiIframeHeight}px`,
                opacity: loading ? 0 : 1,
              }}
              src={`https://api.boldcommerce.com/checkout/storefront/${process.env.NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER}/${giftCardOrder?.publicOrderId}/payments/iframe?token=${giftCardOrder.jwt}`}
            />
            <button
              disabled={paymentMethodAdding}
              onClick={addPaymentMethod}
              style={{
                backgroundColor: '#5059F6',
                borderRadius: '6px',
                height: '46px',
                width: '150px',
                margin: 'auto',
                color: '#FFF',
                fontSize: '18px',
                fontWeight: '800',
                opacity: loading ? 0 : 1,
              }}
            >
              Order
            </button>
          </Flex>
        ) : null}


        {formStage === FormStage.Confirmation ? (
          <Flex
            direction={{ base: 'column' }}
            justifyContent="center"
            alignItems="center"
            gap="28px"
            padding="64px 100px"
            backgroundColor="#F4F4F4"
          >
            <Text
              textAlign="center"
              fontWeight="900"
              fontSize="28px"
              lineHeight="33.6px"
            >
              Thank you for your order! <br /> Your Gift Card Purchase is
              Complete
            </Text>
            <Text lineHeight="24px">
              We&apos;re thrilled to confirm that your gift card purchase
              has been successfully processed.{' '}
            </Text>
            <Text
              textAlign="center"
              fontWeight="900"
              fontSize="28px"
              lineHeight="33.6px"
            >
              Gift Card Number:
            </Text>
            <Text
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                height: '32px',
                padding: '8px 12px',
                backgroundColor: '#5059F6',
                color: '#FFF',
                fontWeight: '800',
              }}
            >
              {generatedGiftCard}
            </Text>
            <Text
              textAlign="center"
              fontWeight="900"
              fontSize="28px"
              lineHeight="33.6px"
            >
              Here&apos;s what happens next:
            </Text>
            <Flex direction={{ base: 'column' }} justifyContent="center">
              <Text>
                <span style={{ fontWeight: '900' }}>
                  Recipient Notification:
                </span>{' '}
                An email with the gift card and your personal message (if
                provided) is on its way to the lucky recipient,{' '}
                {`${getValues().firstName} ${getValues().lastName}`}.
              </Text>
              <Text>
                <span style={{ fontWeight: '900' }}>Instant Joy:</span>{' '}
                The recipient can start shopping on the website right away
                using their gift card.
              </Text>
              <Text>
                <span style={{ fontWeight: '900' }}>Keep Track:</span>{' '}
                You&apos;ll receive a confirmation email shortly,
                outlining your purchase details for your records.
              </Text>
              <NextLink
                style={{ alignSelf: 'center' }}
                href="/category/accessories"
              >
                <Button
                  width="fit-content"
                  margin="28px"
                  padding="10px 24px"
                  variant="outline"
                >
                  Continue Shopping
                </Button>
              </NextLink>
            </Flex>
          </Flex>
        ) : null}



      </main>
    </ChakraProvider>

  );
}
