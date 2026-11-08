"use client";

import CardLink from "@/components/admin/CardLink";
import { useState, useEffect } from "react";
import { Camera, Plus, Search, Eye, CheckCircle, XCircle } from "lucide-react";
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

interface MediaApplication {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  mediaOutlet: string;
  mediaType: string;
  portfolioWebsite: string;
  socialMediaHandles: string;
  accreditationCategory: string;
  previousCoverage: string;
  interestedAspects: string[];
  audienceReach: string;
  audienceDescription: string;
  proofOfWorkUrl?: string;
  proofOfWorkFileName?: string;
  agreementsAccepted: boolean;
  signature: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export default function MediaPage() {
  const [applications, setApplications] = useState<MediaApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<MediaApplication | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/media-accreditation');
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching media applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: number, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/media-accreditation/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchApplications(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.mediaOutlet.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/15 text-green-300">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/15 text-red-300">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/15 text-yellow-300">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Media Accreditation</h1>
          <p className="text-neutral-400 mt-1">Manage media accreditation applications</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Media Outlet
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {applications.filter(a => a.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {applications.filter(a => a.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {applications.filter(a => a.status === 'rejected').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Media Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 w-4 h-4" />
              <Input
                placeholder="Search by name, email, or outlet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-white/15 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead className="hidden sm:table-cell">Media Outlet</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{app.fullName}</div>
                        <div className="text-sm text-neutral-400">{app.email}</div>
                        <div className="text-xs text-neutral-500 sm:hidden">{app.mediaOutlet}</div>
                        <div className="text-xs text-neutral-500 md:hidden">{app.mediaType}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{app.mediaOutlet}</TableCell>
                    <TableCell className="hidden md:table-cell">{app.mediaType}</TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 sm:gap-2">
                        {app.status === 'approved' && <CardLink type="media" id={app.id} name={app.fullName} />}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedApplication(app)}
                              className="px-2 sm:px-3"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Media Application Details</DialogTitle>
                            </DialogHeader>
                            {selectedApplication && (
                              <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                                {/* Personal Information */}
                                <div className="bg-white/5 p-4 rounded-lg">
                                  <h3 className="text-lg font-semibold text-white mb-3">Personal Information</h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-neutral-300">Full Name</label>
                                      <p className="text-white">{selectedApplication.fullName}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-neutral-300">Email</label>
                                      <p className="text-white">{selectedApplication.email}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-neutral-300">Phone Number</label>
                                      <p className="text-white">{selectedApplication.phone}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Media Organization Details */}
                                <div className="bg-white/5 p-4 rounded-lg">
                                  <h3 className="text-lg font-semibold text-white mb-3">Media Organization Details</h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-neutral-300">Media Outlet/Organization</label>
                                      <p className="text-white">{selectedApplication.mediaOutlet}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-neutral-300">Media Type</label>
                                      <p className="text-white">{selectedApplication.mediaType}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-neutral-300">Portfolio Website</label>
                                      <p className="text-white">
                                        <a href={selectedApplication.portfolioWebsite} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 underline">
                                          {selectedApplication.portfolioWebsite}
                                        </a>
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-neutral-300">Accreditation Category</label>
                                      <p className="text-white">{selectedApplication.accreditationCategory}</p>
                                    </div>
                                  </div>
                                  <div className="mt-4">
                                    <label className="text-sm font-medium text-neutral-300">Social Media Handles</label>
                                    <p className="text-white whitespace-pre-wrap">{selectedApplication.socialMediaHandles}</p>
                                  </div>
                                </div>

                                {/* Coverage Details */}
                                <div className="bg-white/5 p-4 rounded-lg">
                                  <h3 className="text-lg font-semibold text-white mb-3">Coverage Details</h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-neutral-300">Audience Reach</label>
                                      <p className="text-white">{selectedApplication.audienceReach}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-neutral-300">Interested Aspects</label>
                                      <p className="text-white">{selectedApplication.interestedAspects?.join(', ') || 'Not specified'}</p>
                                    </div>
                                  </div>
                                  <div className="mt-4 space-y-4">
                                    <div>
                                      <label className="text-sm font-medium text-neutral-300">Previous Coverage</label>
                                      <p className="text-white whitespace-pre-wrap">{selectedApplication.previousCoverage}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-neutral-300">Audience Description</label>
                                      <p className="text-white whitespace-pre-wrap">{selectedApplication.audienceDescription}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Supporting Documents */}
                                <div className="bg-white/5 p-4 rounded-lg">
                                  <h3 className="text-lg font-semibold text-white mb-3">Supporting Documents</h3>
                                  <div>
                                    <label className="text-sm font-medium text-neutral-300">Proof of Work</label>
                                    <p className="text-white">
                                      {selectedApplication.proofOfWorkUrl ? (
                                        <a href={selectedApplication.proofOfWorkUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 underline">
                                          View Document
                                        </a>
                                      ) : 'Not provided'}
                                    </p>
                                  </div>
                                </div>

                                {/* Agreements */}
                                <div className="bg-white/5 p-4 rounded-lg">
                                  <h3 className="text-lg font-semibold text-white mb-3">Agreements</h3>
                                  <div className="space-y-2">
                                    <div>
                                      <label className="text-sm font-medium text-neutral-300">Agreements Accepted</label>
                                      <p className="text-white">{selectedApplication.agreementsAccepted ? 'Yes' : 'No'}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-neutral-300">Signature</label>
                                      <p className="text-white">{selectedApplication.signature}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Status & Timestamps */}
                                <div className="bg-white/5 p-4 rounded-lg">
                                  <h3 className="text-lg font-semibold text-white mb-3">Application Status</h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-neutral-300">Status</label>
                                      <p className={`capitalize font-medium ${selectedApplication.status === 'approved' ? 'text-green-400' : selectedApplication.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'}`}>
                                        {selectedApplication.status}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-neutral-300">Submitted At</label>
                                      <p className="text-white">{new Date(selectedApplication.submittedAt).toLocaleString()}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                  <Button
                                    onClick={() => updateApplicationStatus(selectedApplication.id, 'approved')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}
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
                          onClick={() => updateApplicationStatus(app.id, 'approved')}
                          className="text-green-400 hover:text-green-300 px-2 sm:px-3"
                        >
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateApplicationStatus(app.id, 'rejected')}
                          className="text-red-400 hover:text-red-300 px-2 sm:px-3"
                        >
                          <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-8 text-neutral-400">
              No media applications found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}