"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, Plus, Search, Upload, Eye, Trash2, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  uploadedAt: string;
  isActive: boolean;
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      // For now, we'll use mock data since there's no gallery API yet
      const mockData: GalleryItem[] = [
        {
          id: 1,
          title: "TeensRave 2024 Main Stage",
          description: "The iconic main stage setup for TeensRave 2024",
          imageUrl: "/api/placeholder/400/300",
          category: "Stage",
          uploadedAt: new Date().toISOString(),
          isActive: true,
        },
        {
          id: 2,
          title: "Crowd Performance",
          description: "Amazing crowd energy during the main performance",
          imageUrl: "/api/placeholder/400/300",
          category: "Crowd",
          uploadedAt: new Date().toISOString(),
          isActive: true,
        },
        {
          id: 3,
          title: "Artist Backstage",
          description: "Behind the scenes with our featured artists",
          imageUrl: "/api/placeholder/400/300",
          category: "Backstage",
          uploadedAt: new Date().toISOString(),
          isActive: false,
        },
      ];
      setGalleryItems(mockData);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = galleryItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeItems = galleryItems.filter(item => item.isActive);

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
          <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600 mt-1">Manage festival photos and media gallery</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Upload Images
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{galleryItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Images</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Grid className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(galleryItems.map(item => item.category)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gallery Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gallery Items</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search gallery..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="group relative">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setSelectedItem(item)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{selectedItem?.title}</DialogTitle>
                            </DialogHeader>
                            {selectedItem && (
                              <div className="space-y-4">
                                <div className="aspect-video rounded-lg overflow-hidden">
                                  <Image
                                    src={selectedItem.imageUrl}
                                    alt={selectedItem.title}
                                    width={600}
                                    height={400}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Description</label>
                                  <p className="text-gray-600 mt-1">{selectedItem.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <label className="text-sm font-medium">Category</label>
                                    <p className="mt-1">{selectedItem.category}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <p className={`mt-1 ${selectedItem.isActive ? "text-green-600" : "text-red-600"}`}>
                                      {selectedItem.isActive ? "Active" : "Inactive"}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Uploaded At</label>
                                    <p className="mt-1">{new Date(selectedItem.uploadedAt).toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Image ID</label>
                                    <p className="mt-1 font-mono text-xs">#{selectedItem.id}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium text-sm truncate">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500">{item.category}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
              <p className="text-gray-500 mb-4">Get started by uploading your first image</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload Images
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}