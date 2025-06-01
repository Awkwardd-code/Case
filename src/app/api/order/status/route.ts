/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/order/status/route.ts
import { NextResponse } from 'next/server';
import { getPaymentStatus } from '@/app/thank-you/actions';

export async function POST(req: Request) {
  const { orderId } = await req.json();

  try {
    const order = await getPaymentStatus({ orderId });
    // console.log(order);
    return NextResponse.json({ order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
