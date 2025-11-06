import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Search, Mail, Phone, Award, MapPin, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Officials() {
  const [filters, setFilters] = useState({
    sport: "all",
    search: "",
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list('full_name', 100),
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => base44.entities.Assignment.list('-created_date', 200),
  });

  const officials = users.filter(u => 
    u.app_role === 'official' && u.status === 'active'
  );

  const filteredOfficials = officials.filter((official) => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (!official.full_name?.toLowerCase().includes(search) &&
          !official.email?.toLowerCase().includes(search)) {
        return false;
      }
    }
    if (filters.sport !== "all" && official.sports_qualified) {
      if (!official.sports_qualified.includes(filters.sport)) {
        return false;
      }
    }
    return true;
  });

  const getOfficialStats = (officialId) => {
    const officialAssignments = assignments.filter(a => a.official_id === officialId);
    return {
      total: officialAssignments.length,
      completed: officialAssignments.filter(a => a.status === 'completed').length,
      earnings: officialAssignments.reduce((sum, a) => sum + (a.pay_amount || 0), 0),
    };
  };

  const allSports = [...new Set(
    officials.flatMap(o => o.sports_qualified || [])
  )];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Officials Directory</h1>
          <p className="text-slate-600">
            {filteredOfficials.length} certified officials
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 rounded-xl border-slate-200 focus:border-[#2FFFCB]"
              />
            </div>
            
            <Select value={filters.sport} onValueChange={(value) => setFilters({ ...filters, sport: value })}>
              <SelectTrigger className="rounded-xl border-slate-200 focus:border-[#2FFFCB]">
                <SelectValue placeholder="Filter by sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {allSports.map(sport => (
                  <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Officials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))
        ) : filteredOfficials.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No officials found</h3>
            <p className="text-slate-600">Try adjusting your filters</p>
          </div>
        ) : (
          filteredOfficials.map((official, index) => {
            const stats = getOfficialStats(official.id);
            
            return (
              <motion.div
                key={official.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-[#2FFFCB]" />
                  
                  <CardContent className="p-6 space-y-4">
                    {/* Profile */}
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16 border-2 border-[#2FFFCB]">
                        <AvatarImage src={official.image} />
                        <AvatarFallback className="bg-gradient-to-r from-[#2FFFCB] to-cyan-400 text-slate-900 text-xl font-bold">
                          {official.full_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-cyan-600 transition-colors">
                          {official.full_name}
                        </h3>
                        <p className="text-sm text-slate-600">{official.email}</p>
                        {official.organization && (
                          <p className="text-xs text-slate-500 mt-1">
                            {official.organization}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Sports Qualified */}
                    {official.sports_qualified && official.sports_qualified.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-600 mb-2 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Qualified Sports
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {official.sports_qualified.map(sport => (
                            <Badge
                              key={sport}
                              variant="secondary"
                              className="text-xs"
                            >
                              {sport}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {official.certifications && official.certifications.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-600 mb-2">Certifications</p>
                        <div className="flex flex-wrap gap-2">
                          {official.certifications.slice(0, 3).map((cert, i) => (
                            <Badge
                              key={i}
                              className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs"
                            >
                              {cert}
                            </Badge>
                          ))}
                          {official.certifications.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{official.certifications.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    {official.city && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span>{official.city}, {official.state}</span>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900">
                          {stats.total}
                        </div>
                        <div className="text-xs text-slate-600">Games</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {stats.completed}
                        </div>
                        <div className="text-xs text-slate-600">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">
                          ${stats.earnings}
                        </div>
                        <div className="text-xs text-slate-600">Earned</div>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="flex gap-2 pt-3">
                      {official.email && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 rounded-xl"
                          onClick={() => window.location.href = `mailto:${official.email}`}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                      )}
                      {official.phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 rounded-xl"
                          onClick={() => window.location.href = `tel:${official.phone}`}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}