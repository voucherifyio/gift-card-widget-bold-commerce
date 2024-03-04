# Gift Card Widget Bold Commerce

We developed a widget for the store page to assist undecided shoppers in quickly purchasing a gift card, which can boost store conversion rates. This widget leverages the Bold Commerce service to streamline the gift card purchase process. The widget's design allows for easy integration into any website, eliminating the need for significant alterations to existing store solutions. The generated gift card is managed through Voucherify and is redeemable across all sales channels integrated with Voucherify. We illustrate this with an example store (based on the ComposableUI project), which is also integrated with Voucherify, enabling the utilization of the gift card within this store.

## Table of contents
- [How it works](#how-it-works)
  - [Remeber](#remember)
- [Requirement configuration](#requirement-configuration)
  - [Bold Commerce](#bold-commerce)
  - [Voucherify](#voucherify)
- [How to run Gift Card Widget locally](#how-to-run-gift-card-widget-locally)
  - [Credentials](#credentials) 
  - [Other .env configuration](#other-env-configuration)
  - [Important](#important)
  - [Installation](#installation)
- [Other information](#other-information)
  - [Webhooks](#webhooks)
## How it works
![Screenshot 2024-03-04 at 13 49 02](https://github.com/voucherifyio/gift-card-widget-bold-commerce/assets/77458595/ca5e25d9-73ed-46b8-8558-2195b160785c)

### Remember
Gift card widget is self-hosted solution as an iframe, in that case you have to take care about hosting your own widget.

## Requirement configuration
### Bold Commerce
1. Create account on [Bold Commerce Account Center](https://developer.boldcommerce.com/guides/getting-started/quick-start) as a custom platform.
2. Configure your store with [warehouse](https://developer.boldcommerce.com/api/checkout-admin#tag/Warehouses), [tax zone](https://developer.boldcommerce.com/api/checkout-admin#tag/Tax-Zone-Settings) and [zones](https://developer.boldcommerce.com/api/checkout-admin#tag/Zones) via [Checkout ADMIN API](https://developer.boldcommerce.com/api/checkout-admin). Postman helps you to achieve desired results or you can do this manually in your Bold Commerce Account.
3. [Generate credentials](https://developer.boldcommerce.com/guides/getting-started/quick-start#generate-an-api-access-token) to connect with Bold Commerce [Checkout API](https://developer.boldcommerce.com/api-specifications).
4. Retrieve your `shop_identifier` from [shop info](https://developer.boldcommerce.com/api/shops#tag/Integrations/operation/UninstallIntegration) endpoint to enable final connection with checkout API.

### Voucherify
1. [Login](https://app.voucherify.io/#/login) to your account and go to project settings on the top right corner.
2. Get your application keys
3. [Create campaign](https://support.voucherify.io/article/47-prepaid-gift-cards-campaign) with bulk codes and optionally timeframe settings (if you prefer). Next set value to 0 and save campaign.

## How to run Gift Card Widget locally
### Credentials
Go to .env.example to change file name to .env.local and paste your credentials.
### Bold Commerce
```
BOLD_COMMERCE_ACCESS_TOKEN=xxx123
BOLD_COMMERCE_SHARED_SECRET=123xxx
NEXT_PUBLIC_BOLD_COMMERCE_SHOP_IDENTIFIER=xxx
```
### Voucherify
```
VOUCHERIFY_API_URL=https://api.voucherify.io
VOUCHERIFY_APPLICATION_ID=xxx123
VOUCHERIFY_SECRET_KEY=123xxx
```
### Other `.env` configuration
Set your domain url as:
```
NEXTAUTH_URL=https://your-widget-url.com/
```
### IMPORTANT
Remember to include `/` at the end of url. This is crucial to automatically set your domain as allowed in Bold Commerce [CORS allowlist](https://developer.boldcommerce.com/guides/checkout/checkout-getting-started#add-all-domains-to-cors-allowlist).

### Installation
From the main folder of project use
`npm install`. </br>

Next if you want to work with widget in:

- development mode, use `npm run dev`.
- production mode, use `npm run build && npm run start`

Bold Commerce require to connect with checkout API by trust `https` domains. In this case use [Ngrok](https://ngrok.com/) or other solution to generate domain with `SSL certificate`.

## Other information
### Webhooks
Currently we don't handle webhooks even though there are implemented endpoints in the project. 
