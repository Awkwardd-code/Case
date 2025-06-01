/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/create-checkout-session/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/app/configure/preview/actions';

export async function POST(req: NextRequest) {
  try {
    const { configId } = await req.json();

    if (!configId) {
      return NextResponse.json({ error: 'Missing configId' }, { status: 400 });
    }

    const result = await createCheckoutSession({ configId });

    return NextResponse.json({ success: true, url: result.url }, { status: 200 });
  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
