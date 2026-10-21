export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed." });
  try {
    const { getSandboxPaymentStatus } =
      await import("../server/payment-service.js");
    return res
      .status(200)
      .json(await getSandboxPaymentStatus(req.query?.orderId));
  } catch (error) {
    console.error(
      "MMPay sandbox status lookup failed:",
      error?.message || error,
    );
    return res
      .status(error.statusCode || 502)
      .json({ error: error?.message || "Could not retrieve payment status." });
  }
}
