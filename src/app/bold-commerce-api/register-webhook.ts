export const registerWebhook = async () => {
  const response = await fetch(`/api/webhooks/configuration`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (data.status === 'registered') {
    return data.status
  } else {

  }
  console.log(data, "WEBHOOK");
  return data;
};
