export const initOrder = async (amount: number) => {
  const response = await fetch("/api/init-order", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      amount: amount,
    }),
  });
  const giftCardOrder = await response.json();
  console.log("[initOrder]", giftCardOrder);
  return giftCardOrder;
};
