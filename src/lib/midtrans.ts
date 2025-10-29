import midtransClient from "midtrans-client";

export function getSnap() {
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const clientKey = process.env.MIDTRANS_CLIENT_KEY;

  if (!serverKey || !clientKey) {
    throw new Error("MIDTRANS keys are missing");
  }

  return new midtransClient.Snap({
    isProduction,
    serverKey,
    clientKey,
  });
}
