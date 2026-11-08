import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { databaseError } from '@/lib/admin-api';
import { artistApplications, mediaAccreditation } from '@/lib/schema';

const MAX_PHOTO_LENGTH = 200_000;
const tables = { media: mediaAccreditation, performer: artistApplications };

export async function POST(request: NextRequest) {
  if (!db) return NextResponse.json({ error: 'Database not configured' }, { status: 500 });

  const { type, id, photo } = await request.json().catch(() => ({}));
  const validPhoto = photo === null || (typeof photo === 'string' && photo.length <= MAX_PHOTO_LENGTH && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(photo));
  if ((type !== 'media' && type !== 'performer') || !Number.isInteger(id) || !validPhoto) {
    return NextResponse.json({ error: 'Invalid photo update' }, { status: 400 });
  }

  try {
    const table = tables[type as keyof typeof tables];
    const updated = await db.update(table).set({ cardPhoto: photo }).where(eq(table.id, id)).returning({ id: table.id });
    if (updated.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return databaseError(error);
  }
}
