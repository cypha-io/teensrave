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
      stageName,
      age,
      gender,
      phone,
      email,
      city,
      performanceCategory,
      styleDescription,
      performanceExperience,
      performanceType,
      groupName,
      socialMediaHandles,
      performanceLink,
      previousPerformances,
      performanceImageUrl,
      signedToManagement,
      motivation,
      uniqueSellingPoint,
      goals,
      agreementsAccepted,
    } = await request.json();

    // Validate required fields
    if (!stageName || !email || !performanceCategory || !motivation || !agreementsAccepted) {
      return NextResponse.json(
        { error: 'Stage name, email, performance category, motivation, and agreements acceptance are required' },
        { status: 400 }
      );
    }

    // Insert artist application
    const result = await db
      .insert(artistApplications)
      .values({
        stageName,
        age: age || null,
        gender: gender || null,
        phone: phone || null,
        email,
        city: city || null,
        performanceCategory,
        styleDescription: styleDescription || null,
        performanceExperience: performanceExperience || null,
        performanceType: performanceType || null,
        groupName: groupName || null,
        socialMediaHandles: socialMediaHandles || null,
        performanceLink: performanceLink || null,
        previousPerformances: previousPerformances || null,
        performanceImageUrl: performanceImageUrl || null,
        signedToManagement: signedToManagement || null,
        motivation,
        uniqueSellingPoint: uniqueSellingPoint || null,
        goals: goals || null,
        agreementsAccepted,
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