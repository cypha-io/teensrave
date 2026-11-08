import { pgTable, serial, text, timestamp, varchar, integer, decimal, boolean, jsonb, date, unique } from 'drizzle-orm/pg-core';

// Admin users for dashboard access
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(), // Hashed password
  name: varchar('name', { length: 255 }),
  role: varchar('role', { length: 50 }).default('admin').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at'),
  failedAttempts: integer('failed_attempts').default(0).notNull(),
  lockedUntil: timestamp('locked_until'),
  sessionVersion: integer('session_version').default(1).notNull(),
});

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
  agreementsAccepted: jsonb('agreements_accepted').notNull(), // Array of accepted agreements
  signature: varchar('signature', { length: 255 }).notNull(), // Type your full name as your signature

  // SYSTEM FIELDS
  status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, approved, rejected
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  reviewedAt: timestamp('reviewed_at'),
  reviewerNotes: text('reviewer_notes'),
  cardPhoto: text('card_photo'), // Small JPEG data URL for the printed ID card
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
  cardPhoto: text('card_photo'), // Small JPEG data URL for the printed ID card
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

// Roles hold the permission keys listed in lib/permissions.ts
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  permissions: jsonb('permissions').$type<string[]>().default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Everyone on the team: executives, volunteers, staff and crew
export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  memberCode: varchar('member_code', { length: 20 }).unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  photoUrl: text('photo_url'),
  category: varchar('category', { length: 30 }).default('staff').notNull(),
  position: varchar('position', { length: 255 }),
  department: varchar('department', { length: 255 }),
  roleId: integer('role_id').references(() => roles.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 30 }).default('active').notNull(),
  emergencyContact: varchar('emergency_contact', { length: 255 }),
  validUntil: date('valid_until'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  eventDate: date('event_date'),
  venue: varchar('venue', { length: 255 }),
  timeLabel: varchar('time_label', { length: 100 }),
  ticketUrl: text('ticket_url'),
  isCurrent: boolean('is_current').default(false).notNull(),
  status: varchar('status', { length: 30 }).default('planning').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const ticketTypes = pgTable('ticket_types', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  admits: varchar('admits', { length: 100 }),
  tier: varchar('tier', { length: 50 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  capacity: integer('capacity'),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const ticketSales = pgTable('ticket_sales', {
  id: serial('id').primaryKey(),
  ticketTypeId: integer('ticket_type_id').notNull().references(() => ticketTypes.id, { onDelete: 'restrict' }),
  buyerName: varchar('buyer_name', { length: 255 }).notNull(),
  buyerEmail: varchar('buyer_email', { length: 255 }),
  buyerPhone: varchar('buyer_phone', { length: 50 }),
  quantity: integer('quantity').default(1).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  channel: varchar('channel', { length: 50 }).default('Chale').notNull(),
  paymentReference: varchar('payment_reference', { length: 255 }),
  status: varchar('status', { length: 30 }).default('paid').notNull(),
  checkedIn: boolean('checked_in').default(false).notNull(),
  // Door sales recorded on a device, possibly offline
  clientRef: varchar('client_ref', { length: 64 }).unique(),
  receiptCode: varchar('receipt_code', { length: 32 }),
  deviceLabel: varchar('device_label', { length: 60 }),
  soldBy: varchar('sold_by', { length: 255 }),
  soldAt: timestamp('sold_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  assigneeId: integer('assignee_id').references(() => members.id, { onDelete: 'set null' }),
  priority: varchar('priority', { length: 30 }).default('medium').notNull(),
  status: varchar('status', { length: 30 }).default('open').notNull(),
  dueDate: date('due_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const budgetEntries = pgTable('budget_entries', {
  id: serial('id').primaryKey(),
  kind: varchar('kind', { length: 20 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  description: varchar('description', { length: 500 }).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  entryDate: date('entry_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sponsors = pgTable('sponsors', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  photoUrl: text('photo_url'),
  tier: varchar('tier', { length: 50 }),
  contactName: varchar('contact_name', { length: 255 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 50 }),
  amount: decimal('amount', { precision: 12, scale: 2 }),
  website: text('website'),
  status: varchar('status', { length: 30 }).default('prospect').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const vendors = pgTable('vendors', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  photoUrl: text('photo_url'),
  service: varchar('service', { length: 255 }),
  contactName: varchar('contact_name', { length: 255 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 50 }),
  fee: decimal('fee', { precision: 12, scale: 2 }),
  status: varchar('status', { length: 30 }).default('contacted').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const activityLog = pgTable('activity_log', {
  id: serial('id').primaryKey(),
  actor: varchar('actor', { length: 255 }).notNull(),
  action: varchar('action', { length: 30 }).notNull(),
  resource: varchar('resource', { length: 50 }).notNull(),
  recordId: integer('record_id'),
  summary: text('summary'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Sign-in accounts for everyone who isn't an admin. refId points at the person's own record.
export const userAccounts = pgTable('user_accounts', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  accountType: varchar('account_type', { length: 20 }).notNull(), // member, media, performer, vendor, sponsor
  refId: integer('ref_id').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  mustChangePassword: boolean('must_change_password').default(true).notNull(),
  sessionVersion: integer('session_version').default(1).notNull(),
  failedAttempts: integer('failed_attempts').default(0).notNull(),
  lockedUntil: timestamp('locked_until'),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [unique('user_accounts_person').on(table.accountType, table.refId)]);

// How much each POS teller may sell and admit. Enforced on their device, so it holds offline.
export const posTellers = pgTable('pos_tellers', {
  id: serial('id').primaryKey(),
  memberId: integer('member_id').notNull().unique().references(() => members.id, { onDelete: 'cascade' }),
  ticketsAllocated: integer('tickets_allocated').default(0).notNull(),
  admitLimit: integer('admit_limit').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Optional limit on one ticket type for one teller, on top of their overall allowance.
export const posTellerTickets = pgTable('pos_teller_tickets', {
  id: serial('id').primaryKey(),
  memberId: integer('member_id').notNull().references(() => members.id, { onDelete: 'cascade' }),
  ticketTypeId: integer('ticket_type_id').notNull().references(() => ticketTypes.id, { onDelete: 'cascade' }),
  ticketLimit: integer('ticket_limit').notNull(),
}, (table) => [unique('pos_teller_tickets_pair').on(table.memberId, table.ticketTypeId)]);

// Export types for TypeScript
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type MediaAccreditationApplication = typeof mediaAccreditation.$inferSelect;
export type ArtistApplication = typeof artistApplications.$inferSelect;
export type ShopItem = typeof shopItems.$inferSelect;
export type ShopOrder = typeof shopOrders.$inferSelect;
export type NewsArticle = typeof newsArticles.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;