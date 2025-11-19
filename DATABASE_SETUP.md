# TeensRave Database Setup Guide

This guide will help you set up the Neon database for collecting newsletter subscriptions, media accreditation applications, artist applications, shop orders, and news data.

## Prerequisites

1. A Neon account (https://neon.tech)
2. Node.js and npm installed

## Database Setup

### 1. Create a Neon Database

1. Go to [neon.tech](https://neon.tech) and sign up for an account
2. Create a new project
3. Copy the connection string from your dashboard

### 2. Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Neon database URL:
   ```
   DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
   ```

### 3. Generate and Run Migrations

1. Generate the database schema:
   ```bash
   npm run db:generate
   ```

2. Push the schema to your database:
   ```bash
   npm run db:push
   ```

### 4. Verify Setup

Run the development server to ensure everything works:
```bash
npm run dev
```

## API Endpoints

The following API endpoints are now available:

### Newsletter
- `POST /api/newsletter` - Subscribe to newsletter
- `GET /api/newsletter` - Get all subscribers

### Media Accreditation
- `POST /api/media-accreditation` - Submit media accreditation application
- `GET /api/media-accreditation` - Get all applications

### Artists
- `POST /api/artists` - Submit artist application
- `GET /api/artists` - Get all applications

### Shop
- `POST /api/shop/orders` - Place an order
- `GET /api/shop/orders` - Get all orders
- `GET /api/shop/items` - Get all shop items
- `POST /api/shop/items` - Create a shop item

### News
- `GET /api/news` - Get all news articles
- `POST /api/news` - Create a news article
- `GET /api/news?published=true` - Get only published articles

## Database Schema

The database includes the following tables:

- `newsletter_subscribers` - Email subscribers
- `media_accreditation` - Media accreditation applications
- `artist_applications` - Artist performance applications
- `shop_items` - Products available in the shop
- `shop_orders` - Customer orders
- `news_articles` - News and blog posts

## Next Steps

1. Update your frontend forms to submit data to these API endpoints
2. Consider adding authentication for admin access to view/manage data
3. Set up email notifications for new applications
4. Add data validation and sanitization as needed

## Development Tools

- `npm run db:studio` - Open Drizzle Studio to view/edit data
- `npm run db:generate` - Generate new migrations
- `npm run db:migrate` - Run pending migrations