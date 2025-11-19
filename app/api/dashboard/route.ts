import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletterSubscribers, mediaAccreditation, artistApplications, shopOrders, newsArticles } from '@/lib/schema';
import { eq, desc, sql } from 'drizzle-orm';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Get counts for each table
    const [newsletterCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.isActive, true));

    const [mediaCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(mediaAccreditation);

    const [artistCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(artistApplications);

    const [orderCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(shopOrders);

    const [newsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(newsArticles)
      .where(eq(newsArticles.isPublished, true));

    // Get recent entries
    const recentNewsletters = await db
      .select({
        id: newsletterSubscribers.id,
        email: newsletterSubscribers.email,
        name: newsletterSubscribers.name,
        subscribedAt: newsletterSubscribers.subscribedAt,
      })
      .from(newsletterSubscribers)
      .orderBy(desc(newsletterSubscribers.subscribedAt))
      .limit(5);

    const recentMediaApps = await db
      .select({
        id: mediaAccreditation.id,
        fullName: mediaAccreditation.fullName,
        mediaOutlet: mediaAccreditation.mediaOutlet,
        submittedAt: mediaAccreditation.submittedAt,
        status: mediaAccreditation.status,
      })
      .from(mediaAccreditation)
      .orderBy(desc(mediaAccreditation.submittedAt))
      .limit(5);

    const recentArtistApps = await db
      .select({
        id: artistApplications.id,
        artistName: artistApplications.artistName,
        genre: artistApplications.genre,
        submittedAt: artistApplications.submittedAt,
        status: artistApplications.status,
      })
      .from(artistApplications)
      .orderBy(desc(artistApplications.submittedAt))
      .limit(5);

    const recentOrders = await db
      .select({
        id: shopOrders.id,
        customerName: shopOrders.customerName,
        totalAmount: shopOrders.totalAmount,
        status: shopOrders.status,
        orderedAt: shopOrders.orderedAt,
      })
      .from(shopOrders)
      .orderBy(desc(shopOrders.orderedAt))
      .limit(5);

    return NextResponse.json({
      stats: {
        newsletterSubscribers: newsletterCount.count,
        mediaApplications: mediaCount.count,
        artistApplications: artistCount.count,
        shopOrders: orderCount.count,
        publishedArticles: newsCount.count,
      },
      recent: {
        newsletters: recentNewsletters,
        mediaApplications: recentMediaApps,
        artistApplications: recentArtistApps,
        orders: recentOrders,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}