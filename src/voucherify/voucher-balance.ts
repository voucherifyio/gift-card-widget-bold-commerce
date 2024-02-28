import { VoucherifyError, VoucherifyServerSide } from '@voucherify/sdk'

type VoucherAddBalanceParams = {
  voucherId: string | null
  amount: number
  voucherify: ReturnType<typeof VoucherifyServerSide>
}

export const addVoucherBalance = async (
  params: VoucherAddBalanceParams
): Promise<{
  voucherBalanceResult: string
}> => {
  const { voucherId, voucherify, amount } = params

  if (!voucherId) {
    throw new Error('Missing voucher id')
  }

  try {
    await voucherify.vouchers.balance.create(voucherId, {
      amount: amount * 10,
    })

    return { voucherBalanceResult: 'success' }
  } catch (error) {
    const voucherifyError = error as VoucherifyError
    throw new Error(voucherifyError.message)
  }
}
