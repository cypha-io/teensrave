import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsArticles } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published') === 'true';

    let articles;

    if (publishedOnly) {
      articles = await db
        .select()
        .from(newsArticles)
        .where(eq(newsArticles.isPublished, true))
        .orderBy(desc(newsArticles.createdAt));
    } else {
      articles = await db
        .select()
        .from(newsArticles)
        .orderBy(desc(newsArticles.createdAt));
    }

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching news articles:', error);
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
      title,
      slug,
      content,
      excerpt,
      author,
      category,
      tags,
      featuredImage,
      isPublished,
    } = await request.json();

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Insert news article
    const result = await db
      .insert(newsArticles)
      .values({
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content,
        excerpt: excerpt || null,
        author: author || null,
        category: category || null,
        tags: tags || null,
        featuredImage: featuredImage || null,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
      })
      .returning();

    return NextResponse.json(
      {
        message: 'News article created successfully',
        article: result[0]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('News article creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}