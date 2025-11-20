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

    const formData = await request.formData();

    // Extract form fields
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const mediaOutlet = formData.get('mediaOutlet') as string;
    const mediaType = formData.get('mediaType') as string;
    const portfolioWebsite = formData.get('portfolioWebsite') as string;
    const socialMediaHandles = formData.get('socialMediaHandles') as string;
    const accreditationCategory = formData.get('accreditationCategory') as string;
    const previousCoverage = formData.get('previousCoverage') as string;
    const interestedAspects = JSON.parse(formData.get('interestedAspects') as string || '[]');
    const audienceReach = formData.get('audienceReach') as string;
    const audienceDescription = formData.get('audienceDescription') as string;
    const agreementsAccepted = formData.get('agreementsAccepted') === 'true';
    const signature = formData.get('signature') as string;

    // Handle file upload
    const proofOfWorkFile = formData.get('proofOfWork') as File;
    const proofOfWorkUrl = null; // Will be set when file upload is implemented
    let proofOfWorkFileName = null;

    if (proofOfWorkFile) {
      // In a real implementation, you'd upload this to a cloud storage service
      // For now, we'll just store the filename
      proofOfWorkFileName = proofOfWorkFile.name;
      // proofOfWorkUrl would be the URL from your cloud storage
    }

    // Validate required fields
    if (!fullName || !email || !phone || !mediaOutlet || !mediaType || !portfolioWebsite ||
        !socialMediaHandles || !accreditationCategory || !previousCoverage ||
        interestedAspects.length === 0 || !audienceReach || !audienceDescription ||
        !agreementsAccepted || !signature) {
      return NextResponse.json(
        { error: 'All required fields must be filled out' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Insert media accreditation application
    const result = await db
      .insert(mediaAccreditation)
      .values({
        fullName,
        email,
        phone,
        mediaOutlet,
        mediaType,
        portfolioWebsite,
        socialMediaHandles,
        accreditationCategory,
        previousCoverage,
        interestedAspects,
        audienceReach,
        audienceDescription,
        proofOfWorkUrl,
        proofOfWorkFileName,
        agreementsAccepted,
        signature,
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