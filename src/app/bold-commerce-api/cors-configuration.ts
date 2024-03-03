import "server-only";

type CorsDomainsResponse = {
  id: number;
  domain: string;
};

export const listCors = async (shopIdentifier: string, accessToken: string): Promise<CorsDomainsResponse[]> => {
  const response = await fetch(`https://api.boldcommerce.com/checkout/shop/${shopIdentifier}/cors`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
    cache: "no-cache",
  });
  const { data } = await response.json();

  console.log("[API][GIFT_CARD][listCors] Response:", data);
  return data;
};

export const addCors = async (
  shopIdentifier: string,
  accessToken: string,
  domain: string
): Promise<CorsDomainsResponse[]> => {
  const response = await fetch(`https://api.boldcommerce.com/checkout/shop/${shopIdentifier}/cors`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      domain: domain,
    }),
  });
  const { data } = await response.json();

  console.log(`[API][GIFT_CARD][addCors] Cors added for domain ${domain}, response:`, data);
  return data;
};

const configurationHandler = async () => {
  const { BOLD_COMMERCE_ACCESS_TOKEN, NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER, NEXTAUTH_URL } = process.env;

  if (!BOLD_COMMERCE_ACCESS_TOKEN || !NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER) {
    throw new Error("Missing Bold Commerce configuration");
  }

  if (!NEXTAUTH_URL) {
    throw new Error("Missing domain configuration");
  }
  const listedCorsDomains = await listCors(NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER, BOLD_COMMERCE_ACCESS_TOKEN);
  const isUrlConfigured = listedCorsDomains.find((cors) => cors.domain === NEXTAUTH_URL)?.domain;

  if (!isUrlConfigured) {
    await addCors(NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER, BOLD_COMMERCE_ACCESS_TOKEN, NEXTAUTH_URL);
  } else {
    return { status: "success", message: "Domain added to cors list" };
  }
};

export default configurationHandler;
