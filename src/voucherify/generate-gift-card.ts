import { VoucherifyServerSide } from '@voucherify/sdk'
import { createCustomer } from './create-customer'
import { getCampaign } from './get-campaign'
import { createPublicationCampaign } from './create-publication'
import { addVoucherBalance } from './voucher-balance'

type Customer = {
  email: string
  firstName: string
  lastName: string
  amount: number
}

type CreateGiftCardParams = {
  customer: Customer
  voucherify: ReturnType<typeof VoucherifyServerSide>
}

export const generateGiftCard = async (params: CreateGiftCardParams) => {
  const { customer, voucherify } = params

  const { customerId } = await createCustomer({ customer, voucherify })

  try {
    const { campaignId } = await getCampaign({ voucherify })

    const { publicationCode } = await createPublicationCampaign({
      campaignId,
      customerId,
      voucherify,
    })

    await addVoucherBalance({
      amount: customer.amount,
      voucherId: publicationCode,
      voucherify,
    })

    return { giftCardCode: publicationCode }
  } catch (error) {
    return { error }
  }
}
