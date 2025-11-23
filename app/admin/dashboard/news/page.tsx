"use client";

import { useState, useEffect } from "react";
import { Newspaper, Plus, Search, Eye, Edit, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/news');
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles || []);
      }
    } catch (error) {
      console.error('Error fetching news articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublishStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPublished: !currentStatus,
          publishedAt: !currentStatus ? new Date().toISOString() : null
        }),
      });

      if (response.ok) {
        fetchArticles(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating article status:', error);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'published' && article.isPublished) ||
                         (statusFilter === 'draft' && !article.isPublished);
    return matchesSearch && matchesStatus;
  });

  const publishedArticles = articles.filter(a => a.isPublished);
  const draftArticles = articles.filter(a => !a.isPublished);

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
          <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
          <p className="text-gray-600 mt-1">Create and manage news articles</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{publishedArticles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{draftArticles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(articles.map(a => a.category)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">Author</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Published</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{article.title}</div>
                        <div className="text-sm text-gray-500">{article.excerpt}</div>
                        <div className="text-xs text-gray-400 sm:hidden">{article.author}</div>
                        <div className="text-xs text-gray-400 md:hidden">{article.category}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{article.author}</TableCell>
                    <TableCell className="hidden md:table-cell">{article.category}</TableCell>
                    <TableCell>
                      <Badge className={article.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {article.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "Not published"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedArticle(article)}
                              className="px-2 sm:px-3"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>{selectedArticle?.title}</DialogTitle>
                            </DialogHeader>
                            {selectedArticle && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Author</label>
                                    <p>{selectedArticle.author}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Category</label>
                                    <p>{selectedArticle.category}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <p>{selectedArticle.isPublished ? "Published" : "Draft"}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Slug</label>
                                    <p className="font-mono text-xs">{selectedArticle.slug}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Created</label>
                                    <p>{new Date(selectedArticle.createdAt).toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Published</label>
                                    <p>{selectedArticle.publishedAt ? new Date(selectedArticle.publishedAt).toLocaleString() : "Not published"}</p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Excerpt</label>
                                  <p>{selectedArticle.excerpt}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => togglePublishStatus(selectedArticle.id, selectedArticle.isPublished)}
                                    className={selectedArticle.isPublished ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"}
                                  >
                                    {selectedArticle.isPublished ? "Unpublish" : "Publish"}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" className="px-2 sm:px-3">
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePublishStatus(article.id, article.isPublished)}
                          className={`${article.isPublished ? "text-yellow-600 hover:text-yellow-700" : "text-green-600 hover:text-green-700"} px-2 sm:px-3`}
                        >
                          <span className="hidden sm:inline">{article.isPublished ? "Unpublish" : "Publish"}</span>
                          <span className="sm:hidden">{article.isPublished ? "📝" : "📤"}</span>
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 px-2 sm:px-3">
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No articles found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}