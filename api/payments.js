export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed." });
  try {
    const { createSandboxPayment } =
      await import("../server/payment-service.js");
    const amount = Number(req.body?.amount);
    return res.status(200).json(await createSandboxPayment(amount));
  } catch (error) {
    console.error(
      "MMPay sandbox payment failed:",
      error?.stack || error?.message || error,
    );
    return res
      .status(error.statusCode || 502)
      .json({ error: error?.message || "Could not create a sandbox payment." });
  }
}
