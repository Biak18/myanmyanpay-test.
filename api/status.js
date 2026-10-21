const required = [
  "MMPAY_APP_ID",
  "MMPAY_SANDBOX_PUBLISHABLE_KEY",
  "MMPAY_SANDBOX_SECRET_KEY",
];

export default function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed." });
  const configured = required.every((key) => Boolean(process.env[key]));
  return res.status(200).json({ configured, environment: "sandbox" });
}
