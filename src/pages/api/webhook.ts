import { NextApiRequest, NextApiResponse } from 'next'

const capturePaymentHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  return res.json({ success: true })
}

export default capturePaymentHandler
