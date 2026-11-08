"use client";

import CardLink from "@/components/admin/CardLink";
import { useState, useEffect } from "react";
import { CheckCircle, Phone, Camera, Music, Printer, Search, Copy } from "lucide-react";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MediaApplication {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  mediaOutlet: string;
  mediaType: string;
  status: 'approved';
  submittedAt: string;
}

interface ArtistApplication {
  id: number;
  stageName: string;
  email: string;
  phone: string;
  performanceCategory: string;
  city: string;
  status: 'approved';
  submittedAt: string;
}

export default function AcceptedPage() {
  const [mediaApplications, setMediaApplications] = useState<MediaApplication[]>([]);
  const [artistApplications, setArtistApplications] = useState<ArtistApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedArtists, setCopiedArtists] = useState(false);

  useEffect(() => {
    fetchAcceptedApplications();
  }, []);

  const fetchAcceptedApplications = async () => {
    try {
      // Fetch media applications
      const mediaResponse = await fetch('/api/media-accreditation');
      if (mediaResponse.ok) {
        const mediaData = await mediaResponse.json();
        const acceptedMedia = (mediaData.applications || []).filter((app: MediaApplication) => app.status === 'approved');
        setMediaApplications(acceptedMedia);
      }

      // Fetch artist applications
      const artistResponse = await fetch('/api/artists');
      if (artistResponse.ok) {
        const artistData = await artistResponse.json();
        const acceptedArtists = (artistData.applications || []).filter((app: ArtistApplication) => app.status === 'approved');
        setArtistApplications(acceptedArtists);
      }
    } catch (error) {
      console.error('Error fetching accepted applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyMediaPhoneNumbers = async () => {
    const phoneNumbers = filteredMedia.map(app => app.phone).join('\n');
    try {
      await navigator.clipboard.writeText(phoneNumbers);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy phone numbers:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = phoneNumbers;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyArtistPhoneNumbers = async () => {
    const phoneNumbers = filteredArtists.map(app => app.phone).join('\n');
    try {
      await navigator.clipboard.writeText(phoneNumbers);
      setCopiedArtists(true);
      setTimeout(() => setCopiedArtists(false), 2000);
    } catch (error) {
      console.error('Failed to copy phone numbers:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = phoneNumbers;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedArtists(true);
      setTimeout(() => setCopiedArtists(false), 2000);
    }
  };

  const filteredMedia = mediaApplications.filter(app =>
    app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.mediaOutlet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.phone.includes(searchTerm)
  );

  const filteredArtists = artistApplications.filter(app =>
    app.stageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.performanceCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.phone.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Accepted Applications</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-2 text-sm text-neutral-400">Loading accepted applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Accepted Applications</h2>
        <div className="flex flex-wrap items-center gap-2">
          <a href="/admin/id-cards?type=media" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-white/10"><Printer className="h-4 w-4" aria-hidden="true" />Print Media Cards</a>
          <a href="/admin/id-cards?type=performer" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-white/10"><Printer className="h-4 w-4" aria-hidden="true" />Print Performer Cards</a>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All Accepted ({filteredMedia.length + filteredArtists.length})
          </TabsTrigger>
          <TabsTrigger value="media">
            Media ({filteredMedia.length})
          </TabsTrigger>
          <TabsTrigger value="artists">
            Artists ({filteredArtists.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                All Accepted Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Category/Details</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>ID Card</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedia.map((app) => (
                    <TableRow key={`media-${app.id}`}>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <Camera className="h-3 w-3" />
                          Media
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{app.fullName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-neutral-400" />
                          {app.phone}
                        </div>
                      </TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>{app.mediaOutlet} ({app.mediaType})</TableCell>
                      <TableCell>{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                      <TableCell><CardLink type="media" id={app.id} name={app.fullName} /></TableCell>
                    </TableRow>
                  ))}
                  {filteredArtists.map((app) => (
                    <TableRow key={`artist-${app.id}`}>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <Music className="h-3 w-3" />
                          Artist
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{app.stageName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-neutral-400" />
                          {app.phone}
                        </div>
                      </TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>{app.performanceCategory} ({app.city})</TableCell>
                      <TableCell>{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                      <TableCell><CardLink type="performer" id={app.id} name={app.stageName} /></TableCell>
                    </TableRow>
                  ))}
                  {filteredMedia.length === 0 && filteredArtists.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-neutral-400">
                        No accepted applications found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-green-400" />
                Accepted Media Accreditation ({filteredMedia.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Media Outlet</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>ID Card</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedia.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.fullName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-neutral-400" />
                          {app.phone}
                        </div>
                      </TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>{app.mediaOutlet}</TableCell>
                      <TableCell>{app.mediaType}</TableCell>
                      <TableCell>{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                      <TableCell><CardLink type="media" id={app.id} name={app.fullName} /></TableCell>
                    </TableRow>
                  ))}
                  {filteredMedia.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-neutral-400">
                        No accepted media applications found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Phone Numbers Extraction Section */}
          {filteredMedia.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-green-400" />
                    Media Phone Numbers ({filteredMedia.length})
                  </div>
                  <Button
                    onClick={copyMediaPhoneNumbers}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy All Numbers
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={filteredMedia.map(app => app.phone).join('\n')}
                    readOnly
                    className="min-h-[200px] font-mono text-sm"
                    placeholder="Phone numbers will appear here..."
                  />
                  <div className="text-sm text-neutral-400">
                    <p>• {filteredMedia.length} phone numbers extracted</p>
                    <p>• One number per line for easy copying</p>
                    <p>• Click &quot;Copy All Numbers&quot; to copy to clipboard</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="artists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-green-400" />
                Accepted Artist Applications ({filteredArtists.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stage Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>ID Card</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArtists.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.stageName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-neutral-400" />
                          {app.phone}
                        </div>
                      </TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>{app.performanceCategory}</TableCell>
                      <TableCell>{app.city}</TableCell>
                      <TableCell>{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                      <TableCell><CardLink type="performer" id={app.id} name={app.stageName} /></TableCell>
                    </TableRow>
                  ))}
                  {filteredArtists.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-neutral-400">
                        No accepted artist applications found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Artist Phone Numbers Extraction Section */}
          {filteredArtists.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-green-400" />
                    Artist Phone Numbers ({filteredArtists.length})
                  </div>
                  <Button
                    onClick={copyArtistPhoneNumbers}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {copiedArtists ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy All Numbers
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={filteredArtists.map(app => app.phone).join('\n')}
                    readOnly
                    className="min-h-[200px] font-mono text-sm"
                    placeholder="Phone numbers will appear here..."
                  />
                  <div className="text-sm text-neutral-400">
                    <p>• {filteredArtists.length} phone numbers extracted</p>
                    <p>• One number per line for easy copying</p>
                    <p>• Click &quot;Copy All Numbers&quot; to copy to clipboard</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}