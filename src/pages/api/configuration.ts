import { NextApiRequest, NextApiResponse } from 'next'

export const listCors = async (
  shopIdentifier: string,
  accessToken: string
): Promise<boolean> => {
  const response = await fetch(
    `https://api.boldcommerce.com/checkout/shop/${shopIdentifier}/cors`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json',
      },
    }
  )
  const { data } = await response.json() // Todo: validate response

  console.log('[API][GIFT_CARD][listCors] Response:', data)
  return data
}

export const addCors = async (
  shopIdentifier: string,
  accessToken: string,
  domain: string
): Promise<boolean> => {
  const response = await fetch(
    `https://api.boldcommerce.com/checkout/shop/${shopIdentifier}/cors`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        domain: domain,
      }),
    }
  )
  const { data } = await response.json() // Todo: validate response

  console.log(
    `[API][GIFT_CARD][addCors] Cors added for domain ${domain}, response:`,
    data
  )
  return data
}

const configurationHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!['POST', 'GET'].includes(req.method || '')) {
    return res.status(400).send('Method not supported')
  }

  const {
    BOLD_COMMERCE_ACCESS_TOKEN,
    NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER,
    NEXTAUTH_URL,
  } = process.env

  if (
    !BOLD_COMMERCE_ACCESS_TOKEN ||
    !NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER
  ) {
    return res.status(500).send('Missing Bold Commerce configuration')
  }

  if (!NEXTAUTH_URL) {
    return res.status(500).send('Missing domain configuration')
  }
  if (req.method == 'GET') {
    const success = await listCors(
      NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER,
      BOLD_COMMERCE_ACCESS_TOKEN
    )
    return res.json({ success })
  } else {
    const success = await addCors(
      NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER,
      BOLD_COMMERCE_ACCESS_TOKEN,
      NEXTAUTH_URL
    )
    return res.json({ success })
  }
}

export default configurationHandler
