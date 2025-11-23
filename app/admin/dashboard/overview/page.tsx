"use client";

import { useState, useEffect } from "react";
import {
  Music,
  Camera,
  Mail,
  MessageSquare,
  ShoppingBag,
  Newspaper,
  Image as ImageIcon,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface DashboardStats {
  artists: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  media: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  newsletter: {
    total: number;
    active: number;
  };
  support: {
    total: number;
    unread: number;
    read: number;
    replied: number;
  };
  shop: {
    products: number;
    orders: number;
    revenue: number;
  };
  news: {
    total: number;
    published: number;
    draft: number;
  };
  gallery: {
    total: number;
    active: number;
    inactive: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'artist' | 'media' | 'contact' | 'newsletter';
  title: string;
  status: string;
  timestamp: string;
}

export default function OverviewPage() {
  const [stats, setStats] = useState<DashboardStats>({
    artists: { total: 0, pending: 0, approved: 0, rejected: 0 },
    media: { total: 0, pending: 0, approved: 0, rejected: 0 },
    newsletter: { total: 0, active: 0 },
    support: { total: 0, unread: 0, read: 0, replied: 0 },
    shop: { products: 0, orders: 0, revenue: 0 },
    news: { total: 0, published: 0, draft: 0 },
    gallery: { total: 0, active: 0, inactive: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [
        artistsRes,
        mediaRes,
        newsletterRes,
        contactRes,
        shopItemsRes,
        shopOrdersRes,
        newsRes,
      ] = await Promise.all([
        fetch('/api/artists'),
        fetch('/api/media-accreditation'),
        fetch('/api/newsletter'),
        fetch('/api/contact'),
        fetch('/api/shop/items'),
        fetch('/api/shop/orders'),
        fetch('/api/news'),
      ]);

      const [
        artistsData,
        mediaData,
        newsletterData,
        contactData,
        shopItemsData,
        shopOrdersData,
        newsData,
      ] = await Promise.all([
        artistsRes.json(),
        mediaRes.json(),
        newsletterRes.json(),
        contactRes.json(),
        shopItemsRes.json(),
        shopOrdersRes.json(),
        newsRes.json(),
      ]);

      // Process artists data
      const artists = artistsData.applications || [];
      const artistStats = {
        total: artists.length,
        pending: artists.filter((a: any) => a.status === 'pending').length,
        approved: artists.filter((a: any) => a.status === 'approved').length,
        rejected: artists.filter((a: any) => a.status === 'rejected').length,
      };

      // Process media data
      const mediaApps = mediaData.applications || [];
      const mediaStats = {
        total: mediaApps.length,
        pending: mediaApps.filter((a: any) => a.status === 'pending').length,
        approved: mediaApps.filter((a: any) => a.status === 'approved').length,
        rejected: mediaApps.filter((a: any) => a.status === 'rejected').length,
      };

      // Process newsletter data
      const subscribers = newsletterData.subscribers || [];
      const newsletterStats = {
        total: subscribers.length,
        active: subscribers.filter((s: any) => s.isActive).length,
      };

      // Process support data
      const contacts = contactData.contacts || [];
      const supportStats = {
        total: contacts.length,
        unread: contacts.filter((c: any) => c.status === 'unread').length,
        read: contacts.filter((c: any) => c.status === 'read').length,
        replied: contacts.filter((c: any) => c.status === 'replied').length,
      };

      // Process shop data
      const products = shopItemsData.items || [];
      const orders = shopOrdersData.orders || [];
      const revenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
      const shopStats = {
        products: products.length,
        orders: orders.length,
        revenue: revenue,
      };

      // Process news data
      const articles = newsData.articles || [];
      const newsStats = {
        total: articles.length,
        published: articles.filter((a: any) => a.isPublished).length,
        draft: articles.filter((a: any) => !a.isPublished).length,
      };

      // Mock gallery data (since API doesn't exist yet)
      const galleryStats = {
        total: 15,
        active: 12,
        inactive: 3,
      };

      setStats({
        artists: artistStats,
        media: mediaStats,
        newsletter: newsletterStats,
        support: supportStats,
        shop: shopStats,
        news: newsStats,
        gallery: galleryStats,
      });

      // Generate recent activity
      const activities: RecentActivity[] = [];

      // Add recent artists
      artists.slice(0, 3).forEach((artist: any) => {
        activities.push({
          id: `artist-${artist.id}`,
          type: 'artist',
          title: `${artist.stageName} - Artist Application`,
          status: artist.status,
          timestamp: artist.submittedAt,
        });
      });

      // Add recent media applications
      mediaApps.slice(0, 3).forEach((app: any) => {
        activities.push({
          id: `media-${app.id}`,
          type: 'media',
          title: `${app.fullName} - Media Accreditation`,
          status: app.status,
          timestamp: app.submittedAt,
        });
      });

      // Add recent contacts
      contacts.slice(0, 3).forEach((contact: any) => {
        activities.push({
          id: `contact-${contact.id}`,
          type: 'contact',
          title: `${contact.firstName} ${contact.lastName} - ${contact.subject}`,
          status: contact.status,
          timestamp: contact.submittedAt,
        });
      });

      // Sort by timestamp and take top 10
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activities.slice(0, 10));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (type: string, status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'unread':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'read':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'replied':
        return <MessageSquare className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'artist':
        return <Music className="w-4 h-4 text-purple-600" />;
      case 'media':
        return <Camera className="w-4 h-4 text-blue-600" />;
      case 'contact':
        return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'newsletter':
        return <Mail className="w-4 h-4 text-orange-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  // Mock chart data for applications over time
  const applicationChartData = [
    { month: 'Aug', artists: 12, media: 8, contacts: 15 },
    { month: 'Sep', artists: 18, media: 12, contacts: 22 },
    { month: 'Oct', artists: 25, media: 15, contacts: 28 },
    { month: 'Nov', artists: stats.artists.total, media: stats.media.total, contacts: stats.support.total },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome to TeensRave 2025 Admin Dashboard</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current Date</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Artists */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artist Applications</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.artists.total}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {stats.artists.pending} Pending
              </Badge>
              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                {stats.artists.approved} Approved
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Media Accreditation */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Accreditation</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.media.total}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {stats.media.pending} Pending
              </Badge>
              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                {stats.media.approved} Approved
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Newsletter Subscribers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newsletter.total}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                {stats.newsletter.active} Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Support Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.support.total}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="destructive" className="text-xs">
                {stats.support.unread} Unread
              </Badge>
              <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                {stats.support.replied} Replied
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shop */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shop Overview</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₵{stats.shop.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.shop.orders} orders • {stats.shop.products} products
            </p>
          </CardContent>
        </Card>

        {/* News Articles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">News Articles</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.news.total}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                {stats.news.published} Published
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {stats.news.draft} Draft
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Gallery */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gallery Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.gallery.total}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                {stats.gallery.active} Active
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {stats.gallery.inactive} Inactive
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Application Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={applicationChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="artists" stroke="#8b5cf6" strokeWidth={2} name="Artists" />
                  <Line type="monotone" dataKey="media" stroke="#3b82f6" strokeWidth={2} name="Media" />
                  <Line type="monotone" dataKey="contacts" stroke="#10b981" strokeWidth={2} name="Contacts" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(activity.type, activity.status)}
                      <span className="text-xs text-gray-500 capitalize">
                        {activity.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Festival Status */}
      <Card>
        <CardHeader>
          <CardTitle>Festival Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Music className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{stats.artists.approved}</div>
              <p className="text-sm text-purple-700">Confirmed Artists</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Camera className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{stats.media.approved}</div>
              <p className="text-sm text-blue-700">Accredited Media</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{stats.newsletter.active}</div>
              <p className="text-sm text-green-700">Active Subscribers</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <ImageIcon className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{stats.gallery.active}</div>
              <p className="text-sm text-orange-700">Active Gallery Items</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
