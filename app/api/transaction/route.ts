import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function POST(request: Request) {
  try {
    // Validasi env dulu supaya error-nya jelas
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      throw new Error("MIDTRANS_SERVER_KEY tidak ditemukan di .env.local");
    }

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: serverKey,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    });

    const body = await request.json();

    // Validasi gross_amount dan item_details
    const grossAmount = Math.round(Number(body.gross_amount));
    if (!grossAmount || grossAmount <= 0) {
      throw new Error("gross_amount tidak valid");
    }

    const itemDetails = body.item_details?.map((item: any) => ({
      id: String(item.id),
      price: Math.round(Number(item.price)),
      quantity: Number(item.quantity),
      name: String(item.name).substring(0, 50),
    }));

    // Validasi total item == gross_amount (Midtrans strict soal ini)
    const itemTotal = itemDetails.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    if (itemTotal !== grossAmount) {
      throw new Error(
        `Total item (${itemTotal}) tidak sama dengan gross_amount (${grossAmount})`
      );
    }

    const parameter = {
      transaction_details: {
        order_id: `ORDER-${Date.now()}`,
        gross_amount: grossAmount,
      },
      item_details: itemDetails,
      customer_details: {
        first_name: body.customer_details?.first_name || "Customer",
        email: body.customer_details?.email || "test@example.com",
      },
    };

    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({ token: transaction.token });
  } catch (error: any) {
    console.error("❌ MIDTRANS ERROR:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}