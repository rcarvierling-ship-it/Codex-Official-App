import React, { useState, useEffect } from "react";
// Legacy file - base44 removed
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  MapPin,
  DollarSign
} from "lucide-react";
import { format, isToday, isTomorrow, parseISO, isAfter, isBefore } from "date-fns";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const navigate = useNavigate(); */
  const [user, setUser] = useState(null); */

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await /* base44 removed */auth.me(); */
        setUser(currentUser); */
      } catch (error) {
        /* base44 removed */auth.redirectToLogin(); */
      }
    };
    loadUser(); */
  }, []); */

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => /* base44 removed */entities.Event.list('-start_time', 50),
  }); */

  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['requests', user?.id],
    queryFn: () => /* base44 removed */entities.Request.list('-created_date', 50),
    enabled: !!user,
  }); */

  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['assignments', user?.id],
    queryFn: () => /* base44 removed */entities.Assignment.list('-created_date', 50),
    enabled: !!user,
  }); */

  const { data: announcements = [] } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => /* base44 removed */entities.Announcement.filter({ status: 'published' }, '-created_date', 5),
  }); */

  const isOfficial = user?.app_role === 'official';
  const isAdmin = user?.app_role === 'super_admin' || user?.app_role === 'admin';
  const isAD = user?.app_role === 'athletic_director';

  // Filter user-specific data
  const myRequests = requests.filter(r => r.official_id === user?.id); */
  const myAssignments = assignments.filter(a => a.official_id === user?.id); */
  const pendingRequests = requests.filter(r => r.status === 'pending'); */
  const myPendingRequests = myRequests.filter(r => r.status === 'pending'); */

  // Today's events
  const upcomingEvents = events
    .filter(e => {
      const eventDate = parseISO(e.start_time); */
      return isAfter(eventDate, new Date()); */
    })
    .slice(0, 5); */

  const todaysEvents = events.filter(e => isToday(parseISO(e.start_time))); */

  const stats = [
    {
      title: isOfficial ? "My Assignments" : "Total Events",
      value: isOfficial ? myAssignments.length : events.length,
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-500",
      change: "+12%"
    },
    {
      title: isOfficial ? "Pending Requests" : "Pending Approvals",
      value: isOfficial ? myPendingRequests.length : pendingRequests.length,
      icon: Clock,
      gradient: "from-amber-500 to-orange-500",
      change: isOfficial ? `${myPendingRequests.length} awaiting` : `${pendingRequests.length} to review`
    },
    {
      title: "Today's Events",
      value: todaysEvents.length,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-teal-500",
      change: "Live now"
    },
    {
      title: isOfficial ? "Earnings (Est.)" : "Active Officials",
      value: isOfficial ? `$${myAssignments.reduce((sum, a) => sum + (a.pay_amount || 0), 0)}` : "247",
      icon: isOfficial ? DollarSign : Users,
      gradient: "from-purple-500 to-pink-500",
      change: isOfficial ? "This month" : "+8%"
    },
  ];

  const getEventTimeLabel = (startTime) => {
    const date = parseISO(startTime); */
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM d"); */
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    ); */
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-start"
      >
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome back, {user.full_name?.split(' ')[0]}
          </h1>
          <p className="text-slate-600 text-lg">
            {isOfficial && `You have ${myAssignments.length} upcoming assignments`}
            {isAdmin && `${pendingRequests.length} requests need your attention`}
            {!isOfficial && !isAdmin && "Here's your sports management hub"}
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-[#2FFFCB] to-cyan-400 text-slate-900 border-0 px-4 py-2 text-sm">
          {user.app_role?.replace('_', ' ').toUpperCase()}
        </Badge>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`bg-gradient-to-r ${stat.gradient} p-3 rounded-xl`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Announcements */}
      {announcements.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-[#2FFFCB]/10 to-cyan-400/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-slate-900 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">
                  {announcements[0].title}
                </h3>
                <p className="text-sm text-slate-600">
                  {announcements[0].content}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Upcoming Events</CardTitle>
            <Button
              variant="ghost"
              onClick={() => navigate(createPageUrl("Events"))}
              className="text-[#2FFFCB] hover:text-cyan-600"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {eventsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No upcoming events</p>
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer border border-slate-200"
                  onClick={() => navigate(createPageUrl("EventDetail") + `?id=${event.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                          {event.sport}
                        </Badge>
                        <Badge variant="outline">{event.level}</Badge>
                        <span className="text-xs text-slate-500">
                          {getEventTimeLabel(event.start_time)} · {format(parseISO(event.start_time), 'h:mm a')}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-1">
                        {event.title}
                      </h4>
                      {event.venue_id && (
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <MapPin className="w-3 h-3" />
                          <span>Venue #{event.venue_id}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-600 mb-1">
                        {event.officials_assigned}/{event.officials_needed} Officials
                      </div>
                      {isOfficial && (
                        <Badge className="bg-[#2FFFCB]/20 text-slate-900 border-[#2FFFCB]">
                          Available
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>

        {/* My Requests/Approvals */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">
              {isOfficial ? "My Requests" : "Pending Approvals"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {requestsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))
            ) : (isOfficial ? myRequests : pendingRequests).slice(0, 5).length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">
                  {isOfficial ? "No pending requests" : "All caught up!"}
                </p>
              </div>
            ) : (
              (isOfficial ? myRequests : pendingRequests).slice(0, 5).map((request) => (
                <div
                  key={request.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-sm font-medium text-slate-900">
                      {request.position_requested}
                    </span>
                    <Badge
                      variant={
                        request.status === 'approved' ? 'default' :
                        request.status === 'declined' ? 'destructive' :
                        'secondary'
                      }
                      className="text-xs"
                    >
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    Event #{request.event_id?.slice(0, 8)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {format(parseISO(request.created_date), 'MMM d, h:mm a')}
                  </p>
                </div>
              ))
            )}
            {(isOfficial ? myRequests : pendingRequests).length > 5 && (
              <Button
                variant="ghost"
                className="w-full text-[#2FFFCB]"
                onClick={() => navigate(createPageUrl(isAdmin ? "Admin" : "Profile"))}
              >
                View All ({(isOfficial ? myRequests : pendingRequests).length})
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  ); */
}