"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Search, Eye, Reply, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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

interface ContactSubmission {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  submittedAt: string;
}

export default function SupportPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/contact');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: number, status: 'unread' | 'read' | 'replied') => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchSubmissions(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating submission status:', error);
    }
  };

  const sendReply = async () => {
    if (!selectedSubmission || !replyMessage) return;

    try {
      // This would typically integrate with an email service
      console.log('Sending reply to:', selectedSubmission.email, replyMessage);
      await updateSubmissionStatus(selectedSubmission.id, 'replied');
      setReplyMessage("");
      // Show success message
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'read':
        return <Badge className="bg-green-500/15 text-green-300">Read</Badge>;
      case 'replied':
        return <Badge className="bg-green-500/15 text-green-300">Replied</Badge>;
      default:
        return <Badge className="bg-yellow-500/15 text-yellow-300">Unread</Badge>;
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
          <h1 className="text-3xl font-bold text-white">Support Center</h1>
          <p className="text-neutral-400 mt-1">Manage contact form submissions and customer support</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {submissions.filter(s => s.status === 'unread').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {submissions.filter(s => s.status === 'read').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Replied</CardTitle>
            <Reply className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {submissions.filter(s => s.status === 'replied').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 w-4 h-4" />
              <Input
                placeholder="Search messages..."
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
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sender</TableHead>
                  <TableHead className="hidden sm:table-cell">Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Received</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{submission.firstName} {submission.lastName}</div>
                        <div className="text-sm text-neutral-400">{submission.email}</div>
                        <div className="text-xs text-neutral-500 sm:hidden">{submission.subject}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{submission.subject}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSubmission(submission);
                                if (submission.status === 'unread') {
                                  updateSubmissionStatus(submission.id, 'read');
                                }
                              }}
                              className="px-2 sm:px-3"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Contact Message Details</DialogTitle>
                            </DialogHeader>
                            {selectedSubmission && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Name</label>
                                    <p>{selectedSubmission.firstName} {selectedSubmission.lastName}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <p>{selectedSubmission.email}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <p className={`capitalize ${selectedSubmission.status === 'replied' ? 'text-green-400' : selectedSubmission.status === 'read' ? 'text-green-400' : 'text-yellow-400'}`}>
                                      {selectedSubmission.status}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Submitted At</label>
                                    <p>{new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <label className="text-sm font-medium">Subject</label>
                                    <p>{selectedSubmission.subject}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <label className="text-sm font-medium">Message</label>
                                    <div className="mt-1 p-3 bg-white/5 rounded-md">
                                      <p className="whitespace-pre-wrap text-sm">{selectedSubmission.message}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium">Reply</label>
                                    <Textarea
                                      value={replyMessage}
                                      onChange={(e) => setReplyMessage(e.target.value)}
                                      placeholder="Type your reply..."
                                      rows={4}
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button onClick={sendReply} className="bg-green-600 hover:bg-green-700 text-white">
                                      <Reply className="w-4 h-4 mr-2" />
                                      Send Reply
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateSubmissionStatus(submission.id, 'read')}
                          className="text-green-400 hover:text-green-300 px-2 sm:px-3"
                        >
                          <span className="hidden sm:inline">Mark Read</span>
                          <span className="sm:hidden">✓</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-8 text-neutral-400">
              No messages found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}