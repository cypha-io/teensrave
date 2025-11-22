import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
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

    const submission = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, parseInt(id)))
      .limit(1);

    if (submission.length === 0) {
      return NextResponse.json(
        { error: 'Contact submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ submission: submission[0] });
  } catch (error) {
    console.error('Error fetching contact submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const { status, adminNotes } = await request.json();

    const updateData: Partial<Pick<typeof contactSubmissions.$inferSelect, 'status' | 'adminNotes' | 'repliedAt'>> = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    // If status is 'replied', set repliedAt timestamp
    if (status === 'replied') {
      updateData.repliedAt = new Date();
    }

    const result = await db
      .update(contactSubmissions)
      .set(updateData)
      .where(eq(contactSubmissions.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Contact submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Contact submission updated successfully',
      submission: result[0]
    });
  } catch (error) {
    console.error('Error updating contact submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const result = await db
      .delete(contactSubmissions)
      .where(eq(contactSubmissions.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Contact submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Contact submission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}