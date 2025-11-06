import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LayoutDashboard,
  School,
  Trophy,
  Calendar,
  Users,
  Settings,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO } from "date-fns";

export default function Admin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (currentUser.app_role !== 'super_admin' && currentUser.app_role !== 'admin') {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
          window.location.href = "/";
          return;
        }
        setUser(currentUser);
      } catch (error) {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-created_date', 100),
  });

  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: () => base44.entities.Request.list('-created_date', 100),
  });

  const { data: leagues = [] } = useQuery({
    queryKey: ['leagues'],
    queryFn: () => base44.entities.League.list('name', 100),
  });

  const { data: schools = [] } = useQuery({
    queryKey: ['schools'],
    queryFn: () => base44.entities.School.list('name', 100),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list('full_name', 100),
  });

  const { data: waitlist = [] } = useQuery({
    queryKey: ['waitlist'],
    queryFn: () => base44.entities.Waitlist.list('-created_date', 100),
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => base44.entities.Announcement.list('-created_date', 50),
  });

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const todayEvents = events.filter(e => {
    try {
      const eventDate = parseISO(e.start_time);
      const today = new Date();
      return eventDate.toDateString() === today.toDateString();
    } catch {
      return false;
    }
  });

  const stats = [
    {
      title: "Pending Approvals",
      value: pendingRequests.length,
      icon: Clock,
      gradient: "from-amber-500 to-orange-500",
      description: "Requests awaiting review"
    },
    {
      title: "Today's Events",
      value: todayEvents.length,
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-500",
      description: "Events scheduled today"
    },
    {
      title: "Total Schools",
      value: schools.length,
      icon: School,
      gradient: "from-green-500 to-emerald-500",
      description: "Active schools"
    },
    {
      title: "Active Officials",
      value: users.filter(u => u.app_role === 'official' && u.status === 'active').length,
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
      description: "Certified officials"
    },
  ];

  const deleteMutation = useMutation({
    mutationFn: async ({ entity, id }) => {
      await base44.entities[entity].delete(id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([variables.entity.toLowerCase()]);
      toast({
        title: "Deleted successfully",
        description: `${variables.entity} has been removed.`,
      });
    },
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">Manage your operations in The Official App</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`bg-gradient-to-r ${stat.gradient} p-3 rounded-xl`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border border-slate-200 p-1 rounded-xl flex-wrap h-auto">
          <TabsTrigger value="overview" className="rounded-lg">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="leagues" className="rounded-lg">
            <Trophy className="w-4 h-4 mr-2" />
            Leagues
          </TabsTrigger>
          <TabsTrigger value="schools" className="rounded-lg">
            <School className="w-4 h-4 mr-2" />
            Schools
          </TabsTrigger>
          <TabsTrigger value="events" className="rounded-lg">
            <Calendar className="w-4 h-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="officials" className="rounded-lg">
            <Users className="w-4 h-4 mr-2" />
            Officials
          </TabsTrigger>
          <TabsTrigger value="waitlist" className="rounded-lg">
            <AlertCircle className="w-4 h-4 mr-2" />
            Waitlist
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Events */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.slice(0, 5).map(event => (
                    <div key={event.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-slate-900">{event.title}</p>
                          <p className="text-sm text-slate-600">
                            {event.start_time && format(parseISO(event.start_time), 'MMM d, h:mm a')}
                          </p>
                        </div>
                        <Badge>{event.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Requests */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  Pending Requests ({pendingRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingRequests.slice(0, 5).length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">All caught up!</p>
                    </div>
                  ) : (
                    pendingRequests.slice(0, 5).map(request => (
                      <div key={request.id} className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-slate-900">{request.official_name}</p>
                            <p className="text-sm text-slate-600">{request.position_requested}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              Event #{request.event_id?.slice(0, 8)}
                            </p>
                          </div>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Leagues */}
        <TabsContent value="leagues">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Leagues ({leagues.length})</CardTitle>
              <Button className="bg-gradient-to-r from-[#2FFFCB] to-cyan-400 text-slate-900 rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add League
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leagues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        No leagues yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    leagues.map(league => (
                      <TableRow key={league.id}>
                        <TableCell className="font-medium">{league.name}</TableCell>
                        <TableCell>{league.slug}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              league.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                              'bg-slate-100 text-slate-800 border-slate-200'
                            }
                          >
                            {league.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{league.contact_email || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate({ entity: 'League', id: league.id })}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schools */}
        <TabsContent value="schools">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Schools ({schools.length})</CardTitle>
              <Button className="bg-gradient-to-r from-[#2FFFCB] to-cyan-400 text-slate-900 rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add School
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Mascot</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>AD</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schools.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        No schools yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    schools.map(school => (
                      <TableRow key={school.id}>
                        <TableCell className="font-medium">{school.name}</TableCell>
                        <TableCell>{school.mascot || '-'}</TableCell>
                        <TableCell>{school.city}, {school.state}</TableCell>
                        <TableCell>{school.athletic_director || '-'}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              school.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                              'bg-slate-100 text-slate-800 border-slate-200'
                            }
                          >
                            {school.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate({ entity: 'School', id: school.id })}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events */}
        <TabsContent value="events">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Events ({events.length})</CardTitle>
              <Button className="bg-gradient-to-r from-[#2FFFCB] to-cyan-400 text-slate-900 rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Sport</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Officials</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        No events yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    events.slice(0, 20).map(event => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.sport}</Badge>
                        </TableCell>
                        <TableCell>
                          {event.start_time && format(parseISO(event.start_time), 'MMM d, h:mm a')}
                        </TableCell>
                        <TableCell>
                          {event.officials_assigned || 0}/{event.officials_needed}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              event.status === 'scheduled' ? 'bg-green-100 text-green-800 border-green-200' :
                              event.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              'bg-slate-100 text-slate-800 border-slate-200'
                            }
                          >
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate({ entity: 'Event', id: event.id })}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Officials */}
        <TabsContent value="officials">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Officials ({users.filter(u => u.app_role === 'official').length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.filter(u => u.app_role === 'official').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        No officials yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.filter(u => u.app_role === 'official').map(official => (
                      <TableRow key={official.id}>
                        <TableCell className="font-medium">{official.full_name}</TableCell>
                        <TableCell>{official.email}</TableCell>
                        <TableCell>{official.organization || '-'}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              official.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                              'bg-slate-100 text-slate-800 border-slate-200'
                            }
                          >
                            {official.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Waitlist */}
        <TabsContent value="waitlist">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Waitlist ({waitlist.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waitlist.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        No waitlist entries
                      </TableCell>
                    </TableRow>
                  ) : (
                    waitlist.map(entry => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.name}</TableCell>
                        <TableCell>{entry.email}</TableCell>
                        <TableCell>{entry.organization || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{entry.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              entry.status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                              entry.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                              'bg-slate-100 text-slate-800 border-slate-200'
                            }
                          >
                            {entry.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(parseISO(entry.created_date), 'MMM d, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
