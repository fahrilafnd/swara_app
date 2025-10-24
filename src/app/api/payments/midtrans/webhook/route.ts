import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

type MidtransNotif = {
  order_id: string;
  transaction_status: string;
  status_code: string;
  gross_amount: string; // string dari midtrans
  signature_key: string;
  payment_type?: string;
  fraud_status?: string;
  settlement_time?: string;
};

function verifySignature(n: MidtransNotif) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const raw = n.order_id + n.status_code + n.gross_amount + serverKey;
  const expected = crypto.createHash("sha512").update(raw).digest("hex");
  return expected === n.signature_key;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as MidtransNotif;

  if (!verifySignature(body)) {
    return NextResponse.json(
      { ok: false, message: "Invalid signature" },
      { status: 401 }
    );
  }

  // TODO: update status order di DB kamu berdasarkan body.transaction_status
  // contoh:
  // - "capture"/"settlement" => paid
  // - "pending" => pending
  // - "deny"/"cancel"/"expire" => failed

  console.log("PAYMENT UPDATE", body.order_id, body.transaction_status);

  return NextResponse.json({ ok: true });
}
