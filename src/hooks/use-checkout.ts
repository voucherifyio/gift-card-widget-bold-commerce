import { useState } from 'react'

type GiftCardOrder = {
  publicOrderId: string
  jwt: string
}

const address = {
  country_code: 'PL',
  country: 'Poland',
  // address_line_1: 'Testowa 234',
  // address_line_2: 'sdfsdf',
}

type CreateOrderParams = {
  firstName: string
  lastName: string
  email: string
  amount: number
}

export const useCheckout = () => {
  const [giftCardOrder, setGiftCardOrder] = useState<GiftCardOrder | null>(null)

  const initOrder = async (amount: number) => {
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
      }),
    })
    const giftCardOrder = await response.json()
    console.log('[initOrder]', giftCardOrder)
    return giftCardOrder
  }

  const setPaymentGatewayStyles = async (giftCardOrder: GiftCardOrder) => {
    const response = await fetch(
      `https://api.boldcommerce.com/checkout/storefront/${process.env.NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER}/${giftCardOrder.publicOrderId}/payments/styles`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${giftCardOrder.jwt}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          css_rules: [
            {
              cssText:
                '.PaymentMethods { border: 1px solid #e8e8e8; border-radius: 6px }',
            },
            {
              cssText:
                '.ToggleField__Input ToggleField__Input--Radio { margin: 0 }',
            },

            {
              cssText:
                '.TogglePanel__Content { padding: 8px; background-color: #fafafa }',
            },
            {
              cssText:
                '.PaymentMethod--CreditCard__StoredOption .TogglePanel--alt { border: solid 1px #e8e8e8; border-radius: 6px }',
            },
            {
              cssText:
                '.InputField { margin-right: 3px; border: 1px solid #ccc !important; border-radius: 6px !important; padding: 5px; background-color: #FFF !important }',
            },
            {
              cssText: '#credit_card_expiration_date  {max-width: 80px}',
            },
            {
              cssText: '#credit_card_cvv  {max-width: 32px}',
            },
            {
              cssText: '.Field__Label { display: none }',
            },
            {
              cssText:
                '.CreditCardInfoGroup { display: flex !important; width: 95% !important; margin-left: 15px }',
            },
            {
              cssText:
                '.TogglePanel__Header .Field__InnerWrapper { border-bottom: solid 1px #e8e8e8; padding: 16px 10px !important; background-color: #eaeaf0 }',
            },
            {
              cssText:
                '.TogglePanel__Header .ToggleField__Text { font-size:20px; font-family: sans-serif; }',
            },
            {
              cssText:
                '.TogglePanel__Content .Field__InnerWrapper { border: none !important; padding: 4px 1px 3px 7px !important; background-color: #fafafa  }',
            },
            {
              cssText:
                '.TogglePanel__Content .ToggleField__Text { font-size:17px; font-family: sans-serif }',
            },
            {
              cssText:
                '.Field.Field--WithToggleField.Field--SaveShippingAddressToggle.Field--RememberCardToggle .ToggleField__Text { font-size:14px; font-family: sans-serif}',
            },
            {
              cssText:
                '.Message.Message--HasError {margin: 1px 6px 6px 5px; width: fit-content; padding: 0 10px; background: white; border: 1px solid #dfa2a2; border-radius: 6px;}',
            },
            {
              cssText: '.Message__Content p::before {content: "Error: ";}',
            },
            {
              cssText:
                '.Message__Content p {margin: 4px; font-family: sans-serif; font-size: 14px; color: #dc2626}',
            },
          ],
          media_rules: [],
        }),
      }
    )
    const data = await response.json()
    console.log('[setPaymentGatewayStyles] Response data', data)
    return data
  }

  const capturePayment = async (
    giftCardOrder: GiftCardOrder,
    orderDetails: CreateOrderParams
  ) => {
    const response = await fetch('/api/capture-payment', {
      method: 'POST',
      body: JSON.stringify({
        publicOrderId: giftCardOrder.publicOrderId,
        ...orderDetails,
      }),
    })
    const { data } = await response.json()
    console.log('[capturePayment]', data)

    if (data.error) {
      return { error: data.error }
    }

    return { giftCardCode: data.giftCardCode }
  }
  const setShippingAddress = async (giftCardOrder: GiftCardOrder) => {
    const response = await fetch(
      `https://api.boldcommerce.com/checkout/storefront/${process.env.NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER}/${giftCardOrder?.publicOrderId}/addresses/shipping`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${giftCardOrder?.jwt}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          ...address,
        }),
      }
    )
    const { data } = await response.json()
    console.log('[setShippingAddress] Response data', data)
    return data
  }

  const setShippingLineMethod = async (giftCardOrder: GiftCardOrder) => {
    const response = await fetch(
      `https://api.boldcommerce.com/checkout/storefront/${process.env.NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER}/${giftCardOrder?.publicOrderId}/shipping_lines`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${giftCardOrder?.jwt}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          index: '0',
        }),
      }
    )

    const data = await response.json()
    console.log('[setShippingLineMethod] Response data', data)

    return data
  }
  const createGuestCustomer = async (
    giftCardOrder: GiftCardOrder,
    firstName: string,
    lastName: string,
    email: string
  ) => {
    const response = await fetch(
      `https://api.boldcommerce.com/checkout/storefront/${process.env.NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER}/${giftCardOrder?.publicOrderId}/customer/guest`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${giftCardOrder?.jwt}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email_address: email,
          accepts_marketing: false,
        }),
      }
    )

    const data = await response.json()
    console.log('[setShippingLineMethod] Response data', data)

    return data
  }

  const setBillingAddress = async (giftCardOrder: GiftCardOrder) => {
    const response = await fetch(
      `https://api.boldcommerce.com/checkout/storefront/${process.env.NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER}/${giftCardOrder?.publicOrderId}/addresses/billing`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${giftCardOrder?.jwt}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          ...address,
        }),
      }
    )

    const data = await response.json()
    console.log('[setShippingLineMethod] Response data', data)

    return data
  }
  const generateTaxes = async (giftCardOrder: GiftCardOrder) => {
    const response = await fetch(
      `https://api.boldcommerce.com/checkout/storefront/${process.env.NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER}/${giftCardOrder?.publicOrderId}/taxes`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${giftCardOrder?.jwt}`,
          'Content-type': 'application/json',
        },
      }
    )

    const data = await response.json()
    console.log('[setShippingLineMethod] Response data', data)

    return data
  }

  const processOrder = async (giftCardOrder: GiftCardOrder) => {
    const response = await fetch(
      `https://api.boldcommerce.com/checkout/storefront/${process.env.NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER}/${giftCardOrder?.publicOrderId}/process_order`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${giftCardOrder?.jwt}`,
          'Content-type': 'application/json',
        },
      }
    )

    const data = await response.json()
    console.log('[setShippingLineMethod] Response data', data)

    return data
  }

  const createOrder = async (orderDetails: CreateOrderParams) => {
    const { publicOrderId, jwt }: GiftCardOrder = await initOrder(
      orderDetails.amount
    )
    await setPaymentGatewayStyles({ publicOrderId, jwt })
    await setShippingAddress({ publicOrderId, jwt })
    await setShippingLineMethod({ publicOrderId, jwt })
    await setBillingAddress({ publicOrderId, jwt })
    await generateTaxes({ publicOrderId, jwt })
    await createGuestCustomer(
      { publicOrderId, jwt },
      orderDetails.firstName,
      orderDetails.lastName,
      orderDetails.email
    )
    setGiftCardOrder({ publicOrderId, jwt })
  }

  const finalizeOrder = async (orderDetails: CreateOrderParams) => {
    if (!giftCardOrder?.publicOrderId) {
      throw new Error('You need it create order first')
    }
    await processOrder(giftCardOrder)
    return await capturePayment(giftCardOrder, orderDetails)
  }

  return {
    createOrder,
    finalizeOrder,
    giftCardOrder,
  }
}
