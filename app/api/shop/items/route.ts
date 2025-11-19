import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { shopItems } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const items = await db
      .select()
      .from(shopItems)
      .where(eq(shopItems.isActive, true))
      .orderBy(shopItems.createdAt);

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching shop items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const {
      name,
      description,
      price,
      category,
      imageUrl,
      stockQuantity,
    } = await request.json();

    // Validate required fields
    if (!name || !price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }

    // Insert shop item
    const result = await db
      .insert(shopItems)
      .values({
        name,
        description: description || null,
        price,
        category: category || null,
        imageUrl: imageUrl || null,
        stockQuantity: stockQuantity || 0,
      })
      .returning();

    return NextResponse.json(
      {
        message: 'Shop item created successfully',
        item: result[0]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Shop item creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}