import {
  CampaignResponse,
  VoucherifyError,
  VoucherifyServerSide,
} from '@voucherify/sdk'

type CreateCampaignParams = {
  voucherify: ReturnType<typeof VoucherifyServerSide>
}

export const getCampaign = async (
  params: CreateCampaignParams
): Promise<{ campaignId: string }> => {
  const { voucherify } = params

  const giftCardCampaign = 'Gift Cards From The Widget'

  try {
    const campaign = await voucherify.campaigns.get(giftCardCampaign)

    return { campaignId: campaign.id }
  } catch (error) {
    const voucherifyError = error as VoucherifyError
    throw new Error(voucherifyError.message)
  }
}
