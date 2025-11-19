import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { artistApplications } from '@/lib/schema';

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const {
      artistName,
      email,
      phone,
      stageName,
      genre,
      bio,
      socialMedia,
      website,
      spotifyLink,
      soundcloudLink,
      youtubeLink,
      instagramLink,
      performanceType,
      setLength,
      technicalRequirements,
      previousPerformances,
      motivation,
    } = await request.json();

    // Validate required fields
    if (!artistName || !email) {
      return NextResponse.json(
        { error: 'Artist name and email are required' },
        { status: 400 }
      );
    }

    // Insert artist application
    const result = await db
      .insert(artistApplications)
      .values({
        artistName,
        email,
        phone: phone || null,
        stageName: stageName || null,
        genre: genre || null,
        bio: bio || null,
        socialMedia: socialMedia || null,
        website: website || null,
        spotifyLink: spotifyLink || null,
        soundcloudLink: soundcloudLink || null,
        youtubeLink: youtubeLink || null,
        instagramLink: instagramLink || null,
        performanceType: performanceType || null,
        setLength: setLength || null,
        technicalRequirements: technicalRequirements || null,
        previousPerformances: previousPerformances || null,
        motivation: motivation || null,
      })
      .returning();

    return NextResponse.json(
      {
        message: 'Artist application submitted successfully',
        application: result[0]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Artist application submission error:', error);
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
      .from(artistApplications)
      .orderBy(artistApplications.submittedAt);

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching artist applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}