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
      managementInfo,
      motivation,
      uniqueSellingPoint,
      goals,
      agreementsAccepted,
    } = await request.json();

    // Validate required fields
    if (!stageName || !age || !gender || !phone || !email || !city || !performanceCategory || !styleDescription || !performanceExperience || !performanceType || !socialMediaHandles || !performanceLink || !previousPerformances || signedToManagement === undefined || signedToManagement === null || !motivation || !uniqueSellingPoint || !goals || agreementsAccepted === undefined || agreementsAccepted === null) {
      return NextResponse.json(
        { error: 'All required fields must be provided: stage name, age, gender, phone, email, city, performance category, style description, performance experience, performance type, social media handles, performance link, previous performances, signed to management status, motivation, unique selling point, goals, and agreements acceptance' },
        { status: 400 }
      );
    }

    // Insert artist application
    const result = await db
      .insert(artistApplications)
      .values({
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
        groupName: groupName || null,
        socialMediaHandles,
        performanceLink,
        previousPerformances,
        performanceImageUrl: performanceImageUrl || null,
        signedToManagement,
        managementInfo: managementInfo || null,
        motivation,
        uniqueSellingPoint,
        goals,
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