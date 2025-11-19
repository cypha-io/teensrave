import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { shopOrders } from '@/lib/schema';

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
      orderNotes,
    } = await request.json();

    // Validate required fields
    if (!customerName || !customerEmail || !items || !totalAmount) {
      return NextResponse.json(
        { error: 'Customer name, email, items, and total amount are required' },
        { status: 400 }
      );
    }

    // Insert shop order
    const result = await db
      .insert(shopOrders)
      .values({
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        items,
        totalAmount,
        paymentMethod: paymentMethod || null,
        shippingAddress: shippingAddress || null,
        orderNotes: orderNotes || null,
      })
      .returning();

    return NextResponse.json(
      {
        message: 'Order placed successfully',
        order: result[0]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Shop order submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const orders = await db
      .select()
      .from(shopOrders)
      .orderBy(shopOrders.orderedAt);

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching shop orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}