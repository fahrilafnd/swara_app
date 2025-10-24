import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSnap } from "@/lib/midtrans";

const bodySchema = z.object({
  amount: z.number().int().positive(),
  customer: z.object({
    first_name: z.string(),
    email: z.string().email(),
  }),
  items: z
    .array(
      z.object({
        id: z.string(),
        price: z.number().int().positive(),
        quantity: z.number().int().positive(),
        name: z.string(),
      })
    )
    .min(1),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = bodySchema.parse(json);

    const orderId = `swara_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

    const snap = getSnap();

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: data.amount, // integer in IDR
      },
      item_details: data.items,
      customer_details: {
        first_name: data.customer.first_name,
        email: data.customer.email,
      },
      credit_card: { secure: true },
      callbacks: {
        finish: `${process.env.APP_BASE_URL}/payments/finish?order_id=${orderId}`,
      },
    });

    // Midtrans balikin { token, redirect_url }
    return NextResponse.json({
      token: transaction.token,
      orderId,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create token" },
      { status: 400 }
    );
  }
}
