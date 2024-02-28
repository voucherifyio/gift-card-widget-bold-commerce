import { NextApiRequest, NextApiResponse } from 'next'

type Order = {
  // Todo: more data should be here as BC API response return much more but we do not need it right now
  jwt_token: string
  public_order_id: string
}

export const initializeOrder = async (
  shopIdentifier: string,
  accessToken: string,
  amount: number
): Promise<Order> => {
  const response = await fetch(
    `https://api.boldcommerce.com/checkout/orders/${shopIdentifier}/init`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        cart_items: [
          {
            id: '123',
            quantity: 1,
            title: 'Voucherify Gift Card',
            variant_title: 'Gift Card',
            requires_shipping: false,
            price: amount * 10,
            weight: 0,
            line_item_key: 'ABC123',
            taxable: false,
          },
        ],
      }),
    }
  )
  const { data } = await response.json() // Todo: validate response

  console.log(
    '[API][GIFT_CARD][initializeOrder] Order intialized, response:',
    data
  )
  return data
}

const authOptions = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(400).send('Method not supported')
  }

  const { amount: amountRequested } = req.body
  console.log('req body', req.body)
  console.log('amountRequested', amountRequested)

  if (!amountRequested) {
    return res.status(400).send('Missing amount')
  }

  const amount = Number.parseInt(amountRequested)

  if (!amount || amount <= 0) {
    return res.status(400).send('Amount must be a number larger than 0')
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

  const order = await initializeOrder(
    NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER,
    BOLD_COMMERCE_ACCESS_TOKEN,
    amount
  )

  return res.json({
    jwt: order.jwt_token,
    publicOrderId: order.public_order_id,
  })
}

export default authOptions
