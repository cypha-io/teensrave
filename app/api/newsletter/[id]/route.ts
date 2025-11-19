import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletterSubscribers } from '@/lib/schema';
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
    const { isActive } = await request.json();

    const result = await db
      .update(newsletterSubscribers)
      .set({
        isActive: isActive ?? false,
      })
      .where(eq(newsletterSubscribers.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Newsletter subscriber not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: isActive ? 'Subscriber reactivated successfully' : 'Subscriber unsubscribed successfully',
      subscriber: result[0]
    });
  } catch (error) {
    console.error('Error updating newsletter subscriber:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}