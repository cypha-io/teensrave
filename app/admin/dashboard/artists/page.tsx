"use client";

import { useState, useEffect } from "react";
import { Music, Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
} from "@/components/ui/dialog";

interface ArtistApplication {
  id: number;
  stageName: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  city: string;
  performanceCategory: string;
  styleDescription: string;
  performanceExperience: string;
  performanceType: string;
  groupName: string;
  socialMediaHandles: string;
  performanceLink: string;
  previousPerformances: string;
  performanceImageUrl: string;
  signedToManagement: string;
  motivation: string;
  uniqueSellingPoint: string;
  goals: string;
  agreementsAccepted: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<ArtistApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedArtist, setSelectedArtist] = useState<ArtistApplication | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newArtist, setNewArtist] = useState({
    stageName: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    city: '',
    performanceCategory: '',
    styleDescription: '',
    performanceExperience: '',
    performanceType: '',
    groupName: '',
    socialMediaHandles: '',
    performanceLink: '',
    previousPerformances: '',
    performanceImageUrl: '',
    signedToManagement: '',
    motivation: '',
    uniqueSellingPoint: '',
    goals: '',
    agreementsAccepted: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await fetch('/api/artists');
      if (response.ok) {
        const data = await response.json();
        setArtists(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateArtistStatus = async (id: number, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/artists/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchArtists(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating artist status:', error);
    }
  };

  const handleAddArtist = async () => {
    if (!newArtist.stageName || !newArtist.email || !newArtist.performanceCategory || !newArtist.motivation) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newArtist,
          age: parseInt(newArtist.age),
          agreementsAccepted: true,
          status: 'pending',
        }),
      });

      if (response.ok) {
        setIsAddDialogOpen(false);
        setNewArtist({
          stageName: '',
          age: '',
          gender: '',
          phone: '',
          email: '',
          city: '',
          performanceCategory: '',
          styleDescription: '',
          performanceExperience: '',
          performanceType: '',
          groupName: '',
          socialMediaHandles: '',
          performanceLink: '',
          previousPerformances: '',
          performanceImageUrl: '',
          signedToManagement: '',
          motivation: '',
          uniqueSellingPoint: '',
          goals: '',
          agreementsAccepted: false,
        });
        fetchArtists(); // Refresh the list
      } else {
        alert('Error adding artist application');
      }
    } catch (error) {
      console.error('Error adding artist:', error);
      alert('Error adding artist application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.stageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || artist.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Artist Applications</h1>
          <p className="text-gray-600 mt-1">Manage artist applications for TeensRave 2025</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Artist
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Add New Artist Application</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
              {/* Basic Information */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="stageName">Stage Name *</Label>
                    <Input
                      id="stageName"
                      value={newArtist.stageName}
                      onChange={(e) => setNewArtist({...newArtist, stageName: e.target.value})}
                      placeholder="Artist stage name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={newArtist.age}
                      onChange={(e) => setNewArtist({...newArtist, age: e.target.value})}
                      placeholder="Age"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      value={newArtist.gender}
                      onChange={(e) => setNewArtist({...newArtist, gender: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Select gender"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newArtist.phone}
                      onChange={(e) => setNewArtist({...newArtist, phone: e.target.value})}
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newArtist.email}
                      onChange={(e) => setNewArtist({...newArtist, email: e.target.value})}
                      placeholder="Email address"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={newArtist.city}
                      onChange={(e) => setNewArtist({...newArtist, city: e.target.value})}
                      placeholder="City/Town"
                    />
                  </div>
                </div>
              </div>

              {/* Artist Profile */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Artist Profile</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="performanceCategory">Performance Category *</Label>
                    <select
                      id="performanceCategory"
                      value={newArtist.performanceCategory}
                      onChange={(e) => setNewArtist({...newArtist, performanceCategory: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      title="Select performance category"
                    >
                      <option value="">Select category</option>
                      <option value="rapper">Rapper/MC</option>
                      <option value="singer">Singer/Vocalist</option>
                      <option value="producer">Producer</option>
                      <option value="dj">DJ</option>
                      <option value="instrumentalist">Instrumentalist</option>
                      <option value="band">Band/Group</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="performanceExperience">Performance Experience</Label>
                    <select
                      id="performanceExperience"
                      value={newArtist.performanceExperience}
                      onChange={(e) => setNewArtist({...newArtist, performanceExperience: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Select performance experience level"
                    >
                      <option value="">Select experience level</option>
                      <option value="beginner">Beginner (0-2 years)</option>
                      <option value="intermediate">Intermediate (3-5 years)</option>
                      <option value="experienced">Experienced (6-10 years)</option>
                      <option value="professional">Professional (10+ years)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="performanceType">Performance Type</Label>
                    <select
                      id="performanceType"
                      value={newArtist.performanceType}
                      onChange={(e) => setNewArtist({...newArtist, performanceType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Select performance type"
                    >
                      <option value="">Select performance type</option>
                      <option value="solo">Solo</option>
                      <option value="duo">Duo</option>
                      <option value="group">Group/Band</option>
                      <option value="dj-set">DJ Set</option>
                      <option value="live-band">Live Band</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="groupName">Group/Band Name</Label>
                    <Input
                      id="groupName"
                      value={newArtist.groupName}
                      onChange={(e) => setNewArtist({...newArtist, groupName: e.target.value})}
                      placeholder="Group or band name (if applicable)"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="styleDescription">Style Description</Label>
                  <Textarea
                    id="styleDescription"
                    value={newArtist.styleDescription}
                    onChange={(e) => setNewArtist({...newArtist, styleDescription: e.target.value})}
                    placeholder="Describe your musical style, influences, and what makes your sound unique..."
                    rows={2}
                    className="sm:rows-3"
                  />
                </div>
              </div>

              {/* Portfolio & Links */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Portfolio & Links</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="socialMediaHandles">Social Media Handles</Label>
                    <Textarea
                      id="socialMediaHandles"
                      value={newArtist.socialMediaHandles}
                      onChange={(e) => setNewArtist({...newArtist, socialMediaHandles: e.target.value})}
                      placeholder="Instagram: @yourhandle&#10;Twitter: @yourhandle&#10;TikTok: @yourhandle&#10;Etc."
                      rows={2}
                      className="sm:rows-3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="performanceLink">Performance Link</Label>
                    <Input
                      id="performanceLink"
                      type="url"
                      value={newArtist.performanceLink}
                      onChange={(e) => setNewArtist({...newArtist, performanceLink: e.target.value})}
                      placeholder="https://youtube.com/watch?v=... or https://soundcloud.com/..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="performanceImageUrl">Performance Image URL</Label>
                    <Input
                      id="performanceImageUrl"
                      type="url"
                      value={newArtist.performanceImageUrl}
                      onChange={(e) => setNewArtist({...newArtist, performanceImageUrl: e.target.value})}
                      placeholder="https://example.com/your-performance-image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signedToManagement">Signed to Management</Label>
                    <select
                      id="signedToManagement"
                      value={newArtist.signedToManagement}
                      onChange={(e) => setNewArtist({...newArtist, signedToManagement: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Select if signed to management"
                    >
                      <option value="">Select option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="previousPerformances">Previous Performances</Label>
                  <Textarea
                    id="previousPerformances"
                    value={newArtist.previousPerformances}
                    onChange={(e) => setNewArtist({...newArtist, previousPerformances: e.target.value})}
                    placeholder="List your previous performances, venues, festivals, etc."
                    rows={2}
                    className="sm:rows-3"
                  />
                </div>
              </div>

              {/* Motivation */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Motivation</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <Label htmlFor="motivation">Why do you want to perform at TeensRave? *</Label>
                    <Textarea
                      id="motivation"
                      value={newArtist.motivation}
                      onChange={(e) => setNewArtist({...newArtist, motivation: e.target.value})}
                      placeholder="Tell us why you're passionate about performing at TeensRave and what you hope to achieve..."
                      rows={3}
                      className="sm:rows-4"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="uniqueSellingPoint">What makes you unique?</Label>
                    <Textarea
                      id="uniqueSellingPoint"
                      value={newArtist.uniqueSellingPoint}
                      onChange={(e) => setNewArtist({...newArtist, uniqueSellingPoint: e.target.value})}
                      placeholder="What sets you apart from other artists? What's your unique selling point?"
                      rows={2}
                      className="sm:rows-3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goals">What are your goals for this performance?</Label>
                    <Textarea
                      id="goals"
                      value={newArtist.goals}
                      onChange={(e) => setNewArtist({...newArtist, goals: e.target.value})}
                      placeholder="What do you hope to achieve by performing at TeensRave?"
                      rows={2}
                      className="sm:rows-3"
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="sm:mr-2">
                Cancel
              </Button>
              <Button onClick={handleAddArtist} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? 'Adding...' : 'Add Artist'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{artists.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {artists.filter(a => a.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {artists.filter(a => a.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {artists.filter(a => a.status === 'rejected').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Filter by artist status"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Applications Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artist</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArtists.map((artist) => (
                  <TableRow key={artist.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{artist.stageName}</div>
                        <div className="text-sm text-gray-500">{artist.email}</div>
                        <div className="text-xs text-gray-400 sm:hidden">{artist.performanceCategory}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{artist.performanceCategory}</TableCell>
                    <TableCell>{getStatusBadge(artist.status)}</TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(artist.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedArtist(artist)}
                              className="px-2 sm:px-3"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-lg sm:text-xl">Artist Application Details</DialogTitle>
                            </DialogHeader>
                            {selectedArtist && (
                              <div className="space-y-4 sm:space-y-6 max-h-[70vh] overflow-y-auto px-2 sm:px-0">
                                {/* Basic Information */}
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Stage Name</label>
                                      <p className="text-gray-900">{selectedArtist.stageName}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Age</label>
                                      <p className="text-gray-900">{selectedArtist.age}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Gender</label>
                                      <p className="text-gray-900">{selectedArtist.gender}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Phone</label>
                                      <p className="text-gray-900">{selectedArtist.phone}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Email</label>
                                      <p className="text-gray-900">{selectedArtist.email}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">City</label>
                                      <p className="text-gray-900">{selectedArtist.city || 'Not provided'}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Artist Profile */}
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Artist Profile</h3>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Performance Category</label>
                                      <p className="text-gray-900">{selectedArtist.performanceCategory}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Performance Experience</label>
                                      <p className="text-gray-900">{selectedArtist.performanceExperience || 'Not specified'}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Performance Type</label>
                                      <p className="text-gray-900">{selectedArtist.performanceType || 'Not specified'}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Group/Band Name</label>
                                      <p className="text-gray-900">{selectedArtist.groupName || 'Not applicable'}</p>
                                    </div>
                                  </div>
                                  <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-700">Style Description</label>
                                    <p className="text-gray-900 whitespace-pre-wrap">{selectedArtist.styleDescription || 'Not provided'}</p>
                                  </div>
                                </div>

                                {/* Portfolio & Links */}
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Portfolio & Links</h3>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="md:col-span-2">
                                      <label className="text-sm font-medium text-gray-700">Social Media Handles</label>
                                      <p className="text-gray-900 whitespace-pre-wrap">{selectedArtist.socialMediaHandles || 'Not provided'}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Performance Link</label>
                                      <p className="text-gray-900">
                                        {selectedArtist.performanceLink ? (
                                          <a href={selectedArtist.performanceLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                                            {selectedArtist.performanceLink}
                                          </a>
                                        ) : 'Not provided'}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Performance Image URL</label>
                                      <p className="text-gray-900">
                                        {selectedArtist.performanceImageUrl ? (
                                          <a href={selectedArtist.performanceImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                                            {selectedArtist.performanceImageUrl}
                                          </a>
                                        ) : 'Not provided'}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Signed to Management</label>
                                      <p className="text-gray-900">{selectedArtist.signedToManagement === 'yes' ? 'Yes' : selectedArtist.signedToManagement === 'no' ? 'No' : 'Not specified'}</p>
                                    </div>
                                  </div>
                                  <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-700">Previous Performances</label>
                                    <p className="text-gray-900 whitespace-pre-wrap">{selectedArtist.previousPerformances || 'Not provided'}</p>
                                  </div>
                                </div>

                                {/* Motivation */}
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Motivation</h3>
                                  <div className="space-y-3 sm:space-y-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Why do you want to perform at TeensRave?</label>
                                      <p className="text-gray-900 whitespace-pre-wrap">{selectedArtist.motivation}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">What makes you unique?</label>
                                      <p className="text-gray-900 whitespace-pre-wrap">{selectedArtist.uniqueSellingPoint || 'Not provided'}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">What are your goals for this performance?</label>
                                      <p className="text-gray-900 whitespace-pre-wrap">{selectedArtist.goals || 'Not provided'}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Agreements */}
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Agreements</h3>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Terms & Conditions Accepted</label>
                                    <p className="text-gray-900">{selectedArtist.agreementsAccepted ? 'Yes' : 'No'}</p>
                                  </div>
                                </div>

                                {/* Status & Timestamps */}
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Application Status</h3>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Status</label>
                                      <p className={`capitalize font-medium ${selectedArtist.status === 'approved' ? 'text-green-600' : selectedArtist.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                                        {selectedArtist.status}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Submitted At</label>
                                      <p className="text-gray-900">{new Date(selectedArtist.submittedAt).toLocaleString()}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                  <Button
                                    onClick={() => updateArtistStatus(selectedArtist.id, 'approved')}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() => updateArtistStatus(selectedArtist.id, 'rejected')}
                                    variant="destructive"
                                  >
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateArtistStatus(artist.id, 'approved')}
                          className="text-green-600 hover:text-green-700 px-2 sm:px-3"
                        >
                          <span className="hidden sm:inline">Approve</span>
                          <span className="sm:hidden">✓</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateArtistStatus(artist.id, 'rejected')}
                          className="text-red-600 hover:text-red-700 px-2 sm:px-3"
                        >
                          <span className="hidden sm:inline">Reject</span>
                          <span className="sm:hidden">✗</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredArtists.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No artist applications found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}