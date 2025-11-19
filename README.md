This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Admin Dashboard

The TeensRave website includes an admin dashboard for managing all collected data.

### Accessing the Dashboard

1. Navigate to `/admin/login`
2. Enter the password: `teensrave2024`
3. Access the dashboard at `/admin/dashboard`

### Dashboard Features

- **Sidebar Navigation**: Easy access to different admin sections
- **Statistics Overview**: View counts of newsletter subscribers, media applications, artist applications, shop orders, and published articles
- **Recent Activity**: See the latest entries for each data type
- **Quick Actions**: Direct links to view detailed data for each category
- **Data Management**: Access all API endpoints for CRUD operations

### Navigation Sections

The sidebar provides access to the following sections:

- **Dashboard Overview**: Main statistics and recent activity
- **Newsletter Management**: Manage subscriber data
- **Media Accreditation**: Review media applications
- **Artist Applications**: Review artist submissions
- **Shop Orders**: Manage e-commerce orders
- **News Articles**: Manage published content

### Database Tables

The dashboard manages data from the following tables:

- Newsletter subscribers
- Media accreditation applications
- Artist applications
- Shop items and orders
- News articles

### API Endpoints

- `/api/dashboard` - Dashboard statistics and recent data
- `/api/newsletter` - Newsletter subscriber management
- `/api/media-accreditation` - Media application management
- `/api/artists` - Artist application management
- `/api/shop/orders` - Shop order management
- `/api/news` - News article management

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
