import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { shopOrders } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!status || !['pending', 'paid', 'shipped', 'delivered'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required (pending, paid, shipped, delivered)' },
        { status: 400 }
      );
    }

    const updateData: {
      status: string;
      shippedAt?: Date;
      deliveredAt?: Date;
    } = {
      status,
    };

    // Set timestamps based on status
    if (status === 'shipped') {
      updateData.shippedAt = new Date();
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    }

    const result = await db
      .update(shopOrders)
      .set(updateData)
      .where(eq(shopOrders.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Shop order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Shop order updated successfully',
      order: result[0]
    });
  } catch (error) {
    console.error('Error updating shop order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}