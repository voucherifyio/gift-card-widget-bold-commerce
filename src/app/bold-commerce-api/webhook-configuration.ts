import "server-only";

type ListWebhookResponse = {
  webhook_topic_id: number;
  webhook_topic_name: string;
  callback_url: string;
  created_at: string;
  updated_at: string;
};

const registerFulfilledStatusWebhook = async (
  shopIdentifier: string,
  accessToken: string,
  domain: string
): Promise<[]> => {
  const response = await fetch(`https://api.boldcommerce.com/checkout/shop/${shopIdentifier}/webhooks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      webhook_topic_id: 1,
      callback_url: domain + `api/webhook`,
    }),
  });

  const data = await response.json();
  console.log(`[API][GIFT_CARD][registerWebhook] Webhook registered, response:`, data);
  return data;
};

const listWebhooks = async (shopIdentifier: string, accessToken: string): Promise<ListWebhookResponse[]> => {
  const response = await fetch(`https://api.boldcommerce.com/checkout/shop/${shopIdentifier}/webhooks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  const { data } = await response.json();
  console.log(`[API][GIFT_CARD][listWebhooks], response:`, data);
  return data;
};

const webhooksConfigurationHandler = async () => {
  const { BOLD_COMMERCE_ACCESS_TOKEN, NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER, NEXTAUTH_URL } = process.env;

  if (!BOLD_COMMERCE_ACCESS_TOKEN || !NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER) {
    throw new Error("Missing Bold Commerce configuration");
  }

  if (!NEXTAUTH_URL) {
    throw new Error("Missing domain configuration");
  }

  const STATUS_FULFILLED = "order/fulfilled";
  const listedWebhooks = await listWebhooks(NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER, BOLD_COMMERCE_ACCESS_TOKEN);
  const statusFulfilled = listedWebhooks?.find((webhook) => webhook.webhook_topic_name === STATUS_FULFILLED);

  if (!statusFulfilled) {
    await registerFulfilledStatusWebhook(
      NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER,
      BOLD_COMMERCE_ACCESS_TOKEN,
      NEXTAUTH_URL
    );
    return { status: "registered" };
  } else {
    return { status: "registered" };
  }
};

export default webhooksConfigurationHandler;
