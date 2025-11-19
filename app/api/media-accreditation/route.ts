import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mediaAccreditation } from '@/lib/schema';

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const {
      fullName,
      email,
      phone,
      mediaOutlet,
      position,
      website,
      socialMedia,
      coverageType,
      experience,
      equipment,
      specialRequests,
    } = await request.json();

    // Validate required fields
    if (!fullName || !email || !mediaOutlet) {
      return NextResponse.json(
        { error: 'Full name, email, and media outlet are required' },
        { status: 400 }
      );
    }

    // Insert media accreditation application
    const result = await db
      .insert(mediaAccreditation)
      .values({
        fullName,
        email,
        phone: phone || null,
        mediaOutlet,
        position: position || null,
        website: website || null,
        socialMedia: socialMedia || null,
        coverageType: coverageType || null,
        experience: experience || null,
        equipment: equipment || null,
        specialRequests: specialRequests || null,
      })
      .returning();

    return NextResponse.json(
      {
        message: 'Media accreditation application submitted successfully',
        application: result[0]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Media accreditation submission error:', error);
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

    const applications = await db
      .select()
      .from(mediaAccreditation)
      .orderBy(mediaAccreditation.submittedAt);

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching media accreditation applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}