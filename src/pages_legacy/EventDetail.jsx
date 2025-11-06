import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Mail,
  Phone,
  Award
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

export default function EventDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [eventId, setEventId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    setEventId(id);

    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('-created_date', 100),
  });

  const { data: requests = [] } = useQuery({
    queryKey: ['requests'],
    queryFn: () => base44.entities.Request.list('-created_date', 100),
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => base44.entities.Assignment.list('-created_date', 100),
  });

  const { data: venue } = useQuery({
    queryKey: ['venue', events.find(e => e.id === eventId)?.venue_id],
    queryFn: async () => {
      const event = events.find(e => e.id === eventId);
      if (!event?.venue_id) return null;
      const allVenues = await base44.entities.Venue.list('name', 100);
      return allVenues.find(v => v.id === event.venue_id);
    },
    enabled: !!eventId && !!events.find(e => e.id === eventId)?.venue_id,
  });

  const event = events.find(e => e.id === eventId);
  const eventRequests = requests.filter(r => r.event_id === eventId);
  const eventAssignments = assignments.filter(a => a.event_id === eventId);
  const pendingRequests = eventRequests.filter(r => r.status === 'pending');

  const approveMutation = useMutation({
    mutationFn: async ({ requestId, request }) => {
      // Update request status
      await base44.entities.Request.update(requestId, {
        status: 'approved',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      });

      // Create assignment
      await base44.entities.Assignment.create({
        event_id: request.event_id,
        official_id: request.official_id,
        official_name: request.official_name,
        official_email: request.official_email,
        position: request.position_requested,
        status: 'confirmed',
        pay_amount: event?.pay_rate || 0,
      });

      // Update event officials count
      if (event) {
        await base44.entities.Event.update(event.id, {
          officials_assigned: (event.officials_assigned || 0) + 1,
        });
      }

      // Send email notification
      try {
        await base44.integrations.Core.SendEmail({
          to: request.official_email,
          subject: `Assignment Confirmed: ${event?.title}`,
          body: `Hi ${request.official_name},\n\nYour request to work "${event?.title}" has been approved!\n\nEvent Details:\nDate: ${format(parseISO(event?.start_time), 'MMM d, yyyy')}\nTime: ${format(parseISO(event?.start_time), 'h:mm a')}\nPosition: ${request.position_requested}\n\nThank you!`
        });
      } catch (error) {
        console.log("Email send failed");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['requests']);
      queryClient.invalidateQueries(['assignments']);
      queryClient.invalidateQueries(['events']);
      toast({
        title: "Request approved!",
        description: "Assignment created and official notified.",
      });
    },
  });

  const declineMutation = useMutation({
    mutationFn: async (requestId) => {
      await base44.entities.Request.update(requestId, {
        status: 'declined',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['requests']);
      toast({
        title: "Request declined",
        description: "The official has been notified.",
      });
    },
  });

  const isAdmin = user?.app_role === 'super_admin' || user?.app_role === 'admin';
  const isAD = user?.app_role === 'athletic_director';
  const canApprove = isAdmin || isAD || event?.created_by === user?.email;

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(createPageUrl("Events"))}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Events
      </Button>

      {/* Event Header */}
      <Card className="border-0 shadow-xl">
        <div className="h-3 bg-gradient-to-r from-blue-500 via-cyan-500 to-[#2FFFCB]" />
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {event.title}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      {event.sport}
                    </Badge>
                    <Badge variant="outline">{event.level}</Badge>
                    <Badge
                      className={
                        event.status === 'scheduled' ? 'bg-green-100 text-green-800 border-green-200' :
                        event.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        'bg-slate-100 text-slate-800 border-slate-200'
                      }
                    >
                      {event.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-600">Date & Time</p>
                    <p className="font-medium text-slate-900">
                      {format(parseISO(event.start_time), 'EEEE, MMM d, yyyy')}
                    </p>
                    <p className="text-sm text-slate-600">
                      {format(parseISO(event.start_time), 'h:mm a')}
                      {event.end_time && ` - ${format(parseISO(event.end_time), 'h:mm a')}`}
                    </p>
                  </div>
                </div>

                {venue && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">Venue</p>
                      <p className="font-medium text-slate-900">{venue.name}</p>
                      <p className="text-sm text-slate-600">
                        {venue.city}, {venue.state}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-600">Officials</p>
                    <p className="font-medium text-slate-900">
                      {event.officials_assigned || 0} / {event.officials_needed} assigned
                    </p>
                  </div>
                </div>

                {event.pay_rate && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">Pay Rate</p>
                      <p className="font-medium text-emerald-600">
                        ${event.pay_rate} per official
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {event.special_instructions && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Special Instructions</p>
                    <p className="text-slate-900">{event.special_instructions}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Assigned Officials */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Assigned Officials ({eventAssignments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {eventAssignments.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500">No officials assigned yet</p>
              </div>
            ) : (
              eventAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-r from-[#2FFFCB] to-cyan-400 text-slate-900">
                        {assignment.official_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">
                        {assignment.official_name}
                      </p>
                      <p className="text-sm text-slate-600">{assignment.position}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {assignment.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Pending Requests */}
        {canApprove && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Pending Requests ({pendingRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">No pending requests</p>
                </div>
              ) : (
                pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-amber-200 text-amber-900">
                            {request.official_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">
                            {request.official_name}
                          </p>
                          <p className="text-sm text-slate-600">
                            {request.position_requested}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {format(parseISO(request.created_date), 'MMM d')}
                      </Badge>
                    </div>

                    {request.message && (
                      <p className="text-sm text-slate-600 italic">
                        "{request.message}"
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={() => approveMutation.mutate({ requestId: request.id, request })}
                        disabled={approveMutation.isPending}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => declineMutation.mutate(request.id)}
                        disabled={declineMutation.isPending}
                        variant="outline"
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}