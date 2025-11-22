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
  // PERSONAL INFORMATION
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),

  // MEDIA ORGANIZATION DETAILS
  mediaOutlet: varchar('media_outlet', { length: 255 }).notNull(), // Media Outlet/Organization Name
  mediaType: varchar('media_type', { length: 100 }).notNull(), // Type of Media (TV, Radio, Videographer, etc.)
  portfolioWebsite: varchar('portfolio_website', { length: 500 }).notNull(), // Official Portfolio/Website Link
  socialMediaHandles: text('social_media_handles').notNull(), // Social Media Handles
  accreditationCategory: varchar('accreditation_category', { length: 100 }).notNull(), // Media Accreditation Category

  // COVERAGE DETAILS
  previousCoverage: text('previous_coverage').notNull(), // Have you covered Teensrave or other events before?
  interestedAspects: jsonb('interested_aspects').notNull(), // What aspect of Teensrave are you most interested in capturing?
  audienceReach: varchar('audience_reach', { length: 100 }).notNull(), // Estimated Audience Reach/Audience/Followers
  audienceDescription: text('audience_description').notNull(), // Tell us about your audience

  // SUPPORTING DOCUMENTS
  proofOfWorkUrl: varchar('proof_of_work_url', { length: 500 }), // Letter of Assignment/ Proof of Work file URL
  proofOfWorkFileName: varchar('proof_of_work_file_name', { length: 255 }), // Original file name

  // AGREEMENTS
  agreementsAccepted: boolean('agreements_accepted').default(false).notNull(),
  signature: varchar('signature', { length: 255 }).notNull(), // Type your full name as your signature

  // SYSTEM FIELDS
  status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, approved, rejected
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  reviewedAt: timestamp('reviewed_at'),
  reviewerNotes: text('reviewer_notes'),
});

// Artist applications
export const artistApplications = pgTable('artist_applications', {
  id: serial('id').primaryKey(),

  // PERSONAL INFORMATION
  stageName: varchar('stage_name', { length: 255 }).notNull(),
  age: integer('age').notNull(),
  gender: varchar('gender', { length: 50 }).notNull(), // Male, Female, Other
  phone: varchar('phone', { length: 50 }).notNull(), // Phone Number/ WhatsApp
  email: varchar('email', { length: 255 }).notNull(),
  city: varchar('city', { length: 255 }).notNull(), // City/ Town

  // ARTISTE PROFILE
  performanceCategory: varchar('performance_category', { length: 100 }).notNull(), // Category of Performance
  styleDescription: text('style_description').notNull(), // Briefly describe your style and creative identity
  performanceExperience: varchar('performance_experience', { length: 100 }).notNull(), // How long have you been performing?
  performanceType: varchar('performance_type', { length: 50 }).notNull(), // Solo, Group, Both
  groupName: varchar('group_name', { length: 255 }), // Enter group name (If applicable)

  // PORTFOLIO & LINKS
  socialMediaHandles: text('social_media_handles').notNull(), // Social media handles
  performanceLink: varchar('performance_link', { length: 500 }).notNull(), // Link to your music/video/performance
  previousPerformances: text('previous_performances').notNull(), // Have you performed publicly before?
  performanceImageUrl: varchar('performance_image_url', { length: 500 }), // Upload any performance image or flyer
  performanceImageFileName: varchar('performance_image_file_name', { length: 255 }), // Original file name
  signedToManagement: boolean('signed_to_management').notNull(), // Are you signed to any management or label?
  managementInfo: text('management_info'), // Management name or contact info (if applicable)

  // MOTIVATION
  motivation: text('motivation').notNull(), // Why do you want to perform at Teensrave 25?
  uniqueSellingPoint: text('unique_selling_point').notNull(), // What makes you stand out from other upcoming artistes?
  goals: text('goals').notNull(), // What do you hope to achieve from this platform?

  // AGREEMENTS
  agreementsAccepted: boolean('agreements_accepted').default(false).notNull(),

  // SYSTEM FIELDS
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

// Contact form submissions
export const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 500 }).notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).default('unread').notNull(), // unread, read, replied
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  repliedAt: timestamp('replied_at'),
  adminNotes: text('admin_notes'),
});

// Export types for TypeScript
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type MediaAccreditationApplication = typeof mediaAccreditation.$inferSelect;
export type ArtistApplication = typeof artistApplications.$inferSelect;
export type ShopItem = typeof shopItems.$inferSelect;
export type ShopOrder = typeof shopOrders.$inferSelect;
export type NewsArticle = typeof newsArticles.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;