import {
  CustomerObject,
  VoucherifyError,
  VoucherifyServerSide,
} from '@voucherify/sdk'

type Customer = {
  email: string
  firstName?: string
  lastName?: string
}

type CreateCustomerParams = {
  customer: Customer
  voucherify: ReturnType<typeof VoucherifyServerSide>
}

export const createCustomer = async (
  params: CreateCustomerParams
): Promise<{ customerId: string }> => {
  const { customer, voucherify } = params

  try {
    const createdCustomer = (await voucherify.customers.create({
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
    })) as CustomerObject

    return { customerId: createdCustomer.id }
  } catch (error) {
    const voucherifyError = error as VoucherifyError
    throw new Error(voucherifyError.message)
  }
}
