import { VoucherifyError, VoucherifyServerSide } from "@voucherify/sdk";

type CreatePublicationCampaignParams = {
  campaignId: string;
  customerId: string;
  customerSourceId: string | undefined;
  voucherify: ReturnType<typeof VoucherifyServerSide>;
};

export const createPublicationCampaign = async (
  params: CreatePublicationCampaignParams
): Promise<{
  publicationCode: string;
}> => {
  const { campaignId, customerId, customerSourceId, voucherify } = params;

  if (!campaignId || !customerId) {
    throw new Error("Missing campaign id or customer id");
  }

  try {
    const publication = await voucherify.distributions.publications.create({
      campaign: { name: campaignId },
      customer: { id: customerId, source_id: customerSourceId },
    });

    return {
      publicationCode: publication.voucher.code,
    };
  } catch (error) {
    const voucherifyError = error as VoucherifyError;
    throw new Error(voucherifyError.message);
  }
};
