import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { artistApplications } from '@/lib/schema';
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
    const { status, reviewerNotes } = await request.json();

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required (pending, approved, rejected)' },
        { status: 400 }
      );
    }

    const result = await db
      .update(artistApplications)
      .set({
        status,
        reviewerNotes: reviewerNotes || null,
        reviewedAt: new Date(),
      })
      .where(eq(artistApplications.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Artist application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Artist application updated successfully',
      application: result[0]
    });
  } catch (error) {
    console.error('Error updating artist application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}