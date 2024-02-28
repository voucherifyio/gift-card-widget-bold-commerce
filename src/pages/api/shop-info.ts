import { NextApiRequest, NextApiResponse } from 'next'

export const getShopInfo = async (accessToken: string): Promise<boolean> => {
  const response = await fetch(`https://api.boldcommerce.com/shops/v1/info`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/json',
    },
  })

  console.log(
    `[API][GIFT_CARD][getShopInfo] Response status ${response.status}`
  )

  const data = await response.json() // Todo: validate response

  console.log('[API][GIFT_CARD][getShopInfo] Response:', data)
  return data
}

// Todo: only for development
const getShopInfoHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!['GET'].includes(req.method || '')) {
    return res.status(400).send('Method not supported')
  }

  const { BOLD_COMMERCE_ACCESS_TOKEN, BOLD_COMMERCE_SHARED_SECRET } =
    process.env

  if (!BOLD_COMMERCE_ACCESS_TOKEN || !BOLD_COMMERCE_SHARED_SECRET) {
    return res.status(500).send('Missing Bold Commerce configuration')
  }

  const shopInfo = await getShopInfo(BOLD_COMMERCE_ACCESS_TOKEN)
  return res.json({ shopInfo })
}

export default getShopInfoHandler
