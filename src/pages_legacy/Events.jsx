import React, { useState } from "react";
// Legacy file - base44 removed
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  MapPin,
  Users,
  Filter,
  Search,
  Clock,
  TrendingUp,
  DollarSign,
  ChevronRight
} from "lucide-react";
import { format, parseISO, isToday, isTomorrow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

export default function Events() {
  const navigate = useNavigate(); */
  const queryClient = useQueryClient(); */
  const { toast } = useToast(); */
  const [user, setUser] = useState(null); */
  const [filters, setFilters] = useState({
    sport: "all",
    level: "all",
    status: "scheduled",
    search: "",
  }); */

  React.useEffect(() => {
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

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => /* base44 removed */entities.Event.list('-start_time', 100),
  }); */

  const { data: venues = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: () => /* base44 removed */entities.Venue.list('name', 50),
  }); */

  const { data: schools = [] } = useQuery({
    queryKey: ['schools'],
    queryFn: () => /* base44 removed */entities.School.list('name', 50),
  }); */

  const createRequestMutation = useMutation({
    mutationFn: (requestData) => /* base44 removed */entities.Request.create(requestData),
    onSuccess: () => {
      queryClient.invalidateQueries(['requests']); */
      toast({
        title: "Request submitted!",
        description: "The athletic director will review your request.",
      }); */
    },
  }); */

  const handleRequestToWork = async (event) => {
    if (!user) {
      /* base44 removed */auth.redirectToLogin(); */
      return;
    }

    const requestData = {
      event_id: event.id,
      official_id: user.id,
      official_name: user.full_name,
      official_email: user.email,
      status: "pending",
      position_requested: "referee",
    };

    createRequestMutation.mutate(requestData); */
  };

  const filteredEvents = events.filter((event) => {
    if (filters.sport !== "all" && event.sport !== filters.sport) return false;
    if (filters.level !== "all" && event.level !== filters.level) return false;
    if (filters.status !== "all" && event.status !== filters.status) return false;
    if (filters.search && !event.title?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  }); */

  const getVenueName = (venueId) => {
    const venue = venues.find(v => v.id === venueId); */
    return venue?.name || "TBD";
  };

  const getSchoolName = (schoolId) => {
    const school = schools.find(s => s.id === schoolId); */
    return school?.name || "Unknown";
  };

  const getEventTimeLabel = (startTime) => {
    const date = parseISO(startTime); */
    if (isToday(date)) return { label: "Today", color: "text-green-600" };
    if (isTomorrow(date)) return { label: "Tomorrow", color: "text-blue-600" };
    return { label: format(date, "MMM d"), color: "text-slate-600" };
  };

  const isOfficial = user?.app_role === 'official';

  const sports = [...new Set(events.map(e => e.sport))];
  const levels = [...new Set(events.map(e => e.level))];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Events</h1>
          <p className="text-slate-600">
            {filteredEvents.length} events {filters.status !== 'all' && `· ${filters.status}`}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate(createPageUrl("Dashboard"))}
            variant="outline"
            className="rounded-xl"
          >
            Dashboard
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search events..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 rounded-xl border-slate-200 focus:border-[#2FFFCB]"
              />
            </div>
            
            <Select value={filters.sport} onValueChange={(value) => setFilters({ ...filters, sport: value })}>
              <SelectTrigger className="rounded-xl border-slate-200 focus:border-[#2FFFCB]">
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {sports.map(sport => (
                  <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.level} onValueChange={(value) => setFilters({ ...filters, level: value })}>
              <SelectTrigger className="rounded-xl border-slate-200 focus:border-[#2FFFCB]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger className="rounded-xl border-slate-200 focus:border-[#2FFFCB]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))
          ) : filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No events found</h3>
              <p className="text-slate-600">Try adjusting your filters</p>
            </div>
          ) : (
            filteredEvents.map((event, index) => {
              const timeLabel = getEventTimeLabel(event.start_time); */
              const needsOfficials = event.officials_assigned < event.officials_needed;
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
                    <div
                      className="h-full"
                      onClick={() => navigate(createPageUrl("EventDetail") + `?id=${event.id}`)}
                    >
                      {/* Header Bar */}
                      <div className="h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-[#2FFFCB]" />
                      
                      <CardContent className="p-6 space-y-4">
                        {/* Date & Time */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                              <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className={`font-bold ${timeLabel.color}`}>
                                {timeLabel.label}
                              </p>
                              <p className="text-sm text-slate-600">
                                {format(parseISO(event.start_time), 'h:mm a')}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={
                              event.status === 'scheduled' ? 'bg-green-100 text-green-800 border-green-200' :
                              event.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              event.status === 'completed' ? 'bg-slate-100 text-slate-800 border-slate-200' :
                              'bg-red-100 text-red-800 border-red-200'
                            }
                          >
                            {event.status}
                          </Badge>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                          {event.title}
                        </h3>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                              {event.sport}
                            </Badge>
                            <Badge variant="outline">{event.level}</Badge>
                          </div>
                          <div className="flex items-center gap-2 justify-end text-sm text-slate-600">
                            <Users className="w-4 h-4" />
                            <span>{event.officials_assigned}/{event.officials_needed}</span>
                          </div>
                        </div>

                        {/* Venue */}
                        {event.venue_id && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="w-4 h-4" />
                            <span>{getVenueName(event.venue_id)}</span>
                          </div>
                        )}

                        {/* Pay Rate */}
                        {event.pay_rate && (
                          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                            <DollarSign className="w-4 h-4" />
                            <span>${event.pay_rate} per official</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="pt-4 border-t border-slate-100 flex gap-3">
                          {isOfficial && needsOfficials && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation(); */
                                handleRequestToWork(event); */
                              }}
                              disabled={createRequestMutation.isPending}
                              className="flex-1 bg-gradient-to-r from-[#2FFFCB] to-cyan-400 text-slate-900 hover:shadow-lg rounded-xl font-semibold"
                            >
                              Request to Work
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          )}
                          {!isOfficial && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation(); */
                                navigate(createPageUrl("EventDetail") + `?id=${event.id}`); */
                              }}
                              variant="outline"
                              className="flex-1 rounded-xl"
                            >
                              View Details
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ); */
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  ); */
}