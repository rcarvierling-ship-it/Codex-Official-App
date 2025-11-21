import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Save
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";

export default function Profile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setFormData({
          phone: currentUser.phone || "",
          bio: currentUser.bio || "",
          organization: currentUser.organization || "",
          address: currentUser.address || "",
          city: currentUser.city || "",
          state: currentUser.state || "",
          zip: currentUser.zip || "",
          emergency_contact_name: currentUser.emergency_contact_name || "",
          emergency_contact_phone: currentUser.emergency_contact_phone || "",
          sports_qualified: currentUser.sports_qualified || [],
          certifications: currentUser.certifications || [],
        });
      } catch (error) {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  const { data: myRequests = [] } = useQuery({
    queryKey: ['my-requests', user?.id],
    queryFn: async () => {
      const all = await base44.entities.Request.list('-created_date', 100);
      return all.filter(r => r.official_id === user?.id);
    },
    enabled: !!user?.id,
  });

  const { data: myAssignments = [] } = useQuery({
    queryKey: ['my-assignments', user?.id],
    queryFn: async () => {
      const all = await base44.entities.Assignment.list('-created_date', 100);
      return all.filter(a => a.official_id === user?.id);
    },
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      toast({
        title: "Profile updated!",
        description: "Your changes have been saved.",
      });
      queryClient.invalidateQueries(['user']);
    },
  });

  const handleSave = async (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const addSport = (sport) => {
    if (!formData.sports_qualified.includes(sport)) {
      setFormData({
        ...formData,
        sports_qualified: [...formData.sports_qualified, sport],
      });
    }
  };

  const removeSport = (sport) => {
    setFormData({
      ...formData,
      sports_qualified: formData.sports_qualified.filter(s => s !== sport),
    });
  };

  const addCertification = (cert) => {
    if (cert && !formData.certifications.includes(cert)) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, cert],
      });
    }
  };

  const removeCertification = (cert) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter(c => c !== cert),
    });
  };

  const isOfficial = user?.app_role === 'official';

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  const stats = {
    pending: myRequests.filter(r => r.status === 'pending').length,
    approved: myRequests.filter(r => r.status === 'approved').length,
    completed: myAssignments.filter(a => a.status === 'completed').length,
    earnings: myAssignments.reduce((sum, a) => sum + (a.pay_amount || 0), 0),
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Profile Header */}
      <Card className="border-0 shadow-xl">
        <div className="h-3 bg-gradient-to-r from-blue-500 via-cyan-500 to-[#2FFFCB]" />
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-[#2FFFCB]">
              <AvatarImage src={user.image} />
              <AvatarFallback className="bg-gradient-to-r from-[#2FFFCB] to-cyan-400 text-slate-900 text-3xl font-bold">
                {user.full_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {user.full_name}
              </h1>
              <p className="text-slate-600 mb-3">{user.email}</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-gradient-to-r from-[#2FFFCB] to-cyan-400 text-slate-900 border-0">
                  {user.app_role?.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge
                  className={
                    user.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                    'bg-slate-100 text-slate-800 border-slate-200'
                  }
                >
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>

          {isOfficial && (
            <>
              <Separator className="my-6" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
                  <div className="text-sm text-slate-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
                  <div className="text-sm text-slate-600">Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.completed}</div>
                  <div className="text-sm text-slate-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">${stats.earnings}</div>
                  <div className="text-sm text-slate-600">Earned</div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="bg-white border border-slate-200 p-1 rounded-xl">
          <TabsTrigger value="info" className="rounded-lg">Personal Info</TabsTrigger>
          {isOfficial && <TabsTrigger value="qualifications" className="rounded-lg">Qualifications</TabsTrigger>}
          {isOfficial && <TabsTrigger value="requests" className="rounded-lg">My Requests</TabsTrigger>}
          {isOfficial && <TabsTrigger value="assignments" className="rounded-lg">Assignments</TabsTrigger>}
        </TabsList>

        {/* Personal Info */}
        <TabsContent value="info">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="rounded-xl"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="rounded-xl"
                      placeholder="Your school or league"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="rounded-xl resize-none"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">Address</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="rounded-xl"
                        maxLength={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">Emergency Contact</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergency_name">Contact Name</Label>
                      <Input
                        id="emergency_name"
                        value={formData.emergency_contact_name}
                        onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency_phone">Contact Phone</Label>
                      <Input
                        id="emergency_phone"
                        type="tel"
                        value={formData.emergency_contact_phone}
                        onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="bg-gradient-to-r from-[#2FFFCB] to-cyan-400 text-slate-900 hover:shadow-lg rounded-xl w-full md:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Qualifications */}
        {isOfficial && (
          <TabsContent value="qualifications">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Qualifications & Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sports */}
                <div>
                  <Label className="mb-3 block">Qualified Sports</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.sports_qualified.map(sport => (
                      <Badge
                        key={sport}
                        className="bg-blue-100 text-blue-800 border-blue-200 cursor-pointer"
                        onClick={() => removeSport(sport)}
                      >
                        {sport} ×
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={addSport}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Add a sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {['football', 'basketball', 'baseball', 'softball', 'soccer', 'volleyball', 'wrestling', 'track'].map(sport => (
                        <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Certifications */}
                <div>
                  <Label className="mb-3 block">Certifications</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.certifications.map(cert => (
                      <Badge
                        key={cert}
                        className="bg-emerald-100 text-emerald-800 border-emerald-200 cursor-pointer"
                        onClick={() => removeCertification(cert)}
                      >
                        {cert} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="new-cert"
                      placeholder="Add certification..."
                      className="rounded-xl"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCertification(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => updateProfileMutation.mutate(formData)}
                  disabled={updateProfileMutation.isPending}
                  className="bg-gradient-to-r from-[#2FFFCB] to-cyan-400 text-slate-900 hover:shadow-lg rounded-xl"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Qualifications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* My Requests */}
        {isOfficial && (
          <TabsContent value="requests">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>My Requests ({myRequests.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {myRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No requests yet</p>
                  </div>
                ) : (
                  myRequests.map(request => (
                    <div key={request.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-slate-900">
                            {request.position_requested}
                          </p>
                          <p className="text-sm text-slate-600">
                            Event #{request.event_id?.slice(0, 8)}
                          </p>
                        </div>
                        <Badge
                          variant={
                            request.status === 'approved' ? 'default' :
                            request.status === 'declined' ? 'destructive' :
                            'secondary'
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        {format(parseISO(request.created_date), 'MMM d, yyyy · h:mm a')}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Assignments */}
        {isOfficial && (
          <TabsContent value="assignments">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>My Assignments ({myAssignments.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {myAssignments.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No assignments yet</p>
                  </div>
                ) : (
                  myAssignments.map(assignment => (
                    <div key={assignment.id} className="p-4 rounded-xl bg-green-50 border border-green-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-slate-900">
                            {assignment.position}
                          </p>
                          <p className="text-sm text-slate-600">
                            Event #{assignment.event_id?.slice(0, 8)}
                          </p>
                          {assignment.pay_amount && (
                            <p className="text-sm font-medium text-emerald-600 mt-1">
                              ${assignment.pay_amount}
                            </p>
                          )}
                        </div>
                        <Badge className="bg-green-600 text-white">
                          {assignment.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        {format(parseISO(assignment.created_date), 'MMM d, yyyy · h:mm a')}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}