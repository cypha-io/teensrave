import { pgTable, serial, text, timestamp, varchar, integer, decimal, boolean, jsonb } from 'drizzle-orm/pg-core';

// Newsletter subscribers
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  subscribedAt: timestamp('subscribed_at').defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

// Media accreditation applications
export const mediaAccreditation = pgTable('media_accreditation', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  mediaOutlet: varchar('media_outlet', { length: 255 }).notNull(),
  position: varchar('position', { length: 255 }),
  website: varchar('website', { length: 255 }),
  socialMedia: jsonb('social_media'), // Store as JSON object
  coverageType: varchar('coverage_type', { length: 100 }), // Online, Print, TV, etc.
  experience: text('experience'),
  equipment: text('equipment'),
  specialRequests: text('special_requests'),
  status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, approved, rejected
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  reviewedAt: timestamp('reviewed_at'),
  reviewerNotes: text('reviewer_notes'),
});

// Artist applications
export const artistApplications = pgTable('artist_applications', {
  id: serial('id').primaryKey(),
  artistName: varchar('artist_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  stageName: varchar('stage_name', { length: 255 }),
  genre: varchar('genre', { length: 100 }),
  bio: text('bio'),
  socialMedia: jsonb('social_media'), // Store as JSON object
  website: varchar('website', { length: 255 }),
  spotifyLink: varchar('spotify_link', { length: 255 }),
  soundcloudLink: varchar('soundcloud_link', { length: 255 }),
  youtubeLink: varchar('youtube_link', { length: 255 }),
  instagramLink: varchar('instagram_link', { length: 255 }),
  performanceType: varchar('performance_type', { length: 100 }), // DJ, Live Band, MC, etc.
  setLength: varchar('set_length', { length: 50 }), // 30min, 1hr, etc.
  technicalRequirements: text('technical_requirements'),
  previousPerformances: text('previous_performances'),
  motivation: text('motivation'),
  status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, approved, rejected
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  reviewedAt: timestamp('reviewed_at'),
  reviewerNotes: text('reviewer_notes'),
});

// Shop items/products
export const shopItems = pgTable('shop_items', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category', { length: 100 }),
  imageUrl: varchar('image_url', { length: 500 }),
  stockQuantity: integer('stock_quantity').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Shop orders
export const shopOrders = pgTable('shop_orders', {
  id: serial('id').primaryKey(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 50 }),
  items: jsonb('items').notNull(), // Array of {itemId, quantity, price}
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, paid, shipped, delivered
  paymentMethod: varchar('payment_method', { length: 50 }),
  shippingAddress: jsonb('shipping_address'), // Store as JSON object
  orderNotes: text('order_notes'),
  orderedAt: timestamp('ordered_at').defaultNow().notNull(),
  shippedAt: timestamp('shipped_at'),
  deliveredAt: timestamp('delivered_at'),
});

// News articles
export const newsArticles = pgTable('news_articles', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  author: varchar('author', { length: 255 }),
  category: varchar('category', { length: 100 }),
  tags: jsonb('tags'), // Array of tags
  featuredImage: varchar('featured_image', { length: 500 }),
  isPublished: boolean('is_published').default(false).notNull(),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Export types for TypeScript
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type MediaAccreditationApplication = typeof mediaAccreditation.$inferSelect;
export type ArtistApplication = typeof artistApplications.$inferSelect;
export type ShopItem = typeof shopItems.$inferSelect;
export type ShopOrder = typeof shopOrders.$inferSelect;
export type NewsArticle = typeof newsArticles.$inferSelect;