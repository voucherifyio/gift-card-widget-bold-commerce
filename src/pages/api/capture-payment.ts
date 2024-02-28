import { NextApiRequest, NextApiResponse } from 'next'
import { generateGiftCard } from '../../voucherify/generate-gift-card'
import { getVoucherify } from '../../voucherify/voucherify-config'

type CreateOrderParams = {
  firstName: string
  lastName: string
  email: string
  amount: number
}

export const capturePayment = async (
  shopIdentifier: string,
  accessToken: string,
  publicOrderId: string,
  orderDetails: CreateOrderParams
): Promise<any> => {
  const currentDate = new Date().getTime()
  const response = await fetch(
    `https://api.boldcommerce.com/checkout/orders/${shopIdentifier}/${publicOrderId}/payments/capture/full`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        reauth: true,
      }),
    }
  )
  const data = await response.json() // Todo: validate response
  console.log(
    '[API][GIFT_CARD][capturePayment] Order intialized, response:',
    data
  )
  const { giftCardCode, error } = await generateGiftCard({
    customer: orderDetails,
    voucherify: getVoucherify(),
  })

  if (error) {
    return { error: 'Generate gift card is not possible for some reasons.' }
  }

  return { giftCardCode }
}

const capturePaymentHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'POST') {
    return res.status(400).send('Method not supported')
  }

  const { publicOrderId, firstName, lastName, email, amount } = JSON.parse(
    req.body
  ) // Todo ONLY DEVELOPMENT! DANGEROUS!

  if (!publicOrderId) {
    return res.status(400).send('Missing publicOrderId')
  }

  const {
    BOLD_COMMERCE_ACCESS_TOKEN,
    NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER,
  } = process.env

  if (
    !BOLD_COMMERCE_ACCESS_TOKEN ||
    !NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER
  ) {
    return res.status(500).send('Missing Bold Commerce configuration')
  }

  const data = await capturePayment(
    NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER,
    BOLD_COMMERCE_ACCESS_TOKEN,
    publicOrderId,
    { firstName, lastName, email, amount }
  )

  return res.json({ data })
}

export default capturePaymentHandler
