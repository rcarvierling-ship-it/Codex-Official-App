
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CircleDot,
  Calendar,
  Users,
  CheckCircle,
  Zap,
  Shield,
  ArrowRight,
  Sparkles,
  Clock,
  MapPin
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

export default function Landing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    role: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await base44.entities.Waitlist.create(formData);
      
      // Send confirmation email
      try {
        await base44.integrations.Core.SendEmail({
          to: formData.email,
          subject: "Welcome to The Official App Waitlist",
          body: `Hi ${formData.name},\n\nThank you for joining our waitlist! We're excited to have you.\n\nWe'll reach out soon with updates about your access.\n\nBest regards,\nThe Official App Team`
        });
      } catch (emailError) {
        console.log("Email send failed, but waitlist entry created");
      }

      toast({
        title: "You're on the list! 🎉",
        description: "Check your email for confirmation.",
      });

      setFormData({
        name: "",
        email: "",
        organization: "",
        phone: "",
        role: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Intelligent event management with real-time availability tracking",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Official Matching",
      description: "Seamless request-to-work flow with instant approvals",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Instant notifications for assignments and schedule changes",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Secure permissions for admins, ADs, coaches, and officials",
      gradient: "from-emerald-500 to-teal-500"
    },
  ];

  const stats = [
    { label: "Events Managed", value: "10K+" },
    { label: "Officials", value: "500+" },
    { label: "Schools", value: "150+" },
    { label: "Leagues", value: "20+" },
  ];

  return (
    <div className="min-h-screen">
      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-slate-900/80 backdrop-blur-2xl rounded-full px-6 py-3 shadow-2xl border border-slate-700"
        >
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-[#2FFFCB] to-cyan-400 p-2 rounded-xl">
                <CircleDot className="w-5 h-5 text-slate-900" />
              </div>
              <span className="font-bold text-white">The Official App</span>
            </div>
            <Button
              onClick={() => base44.auth.redirectToLogin()}
              className="bg-gradient-to-r from-[#2FFFCB] to-cyan-400 text-slate-900 hover:shadow-lg hover:scale-105 transition-all duration-200 rounded-full font-semibold"
            >
              Launch App
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <Badge className="bg-[#2FFFCB]/10 text-[#2FFFCB] border-[#2FFFCB]/20 px-4 py-1.5">
              <Sparkles className="w-3 h-3 mr-1" />
              Modern Sports Management
            </Badge>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent">
                Officials
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#2FFFCB] via-cyan-400 to-[#2FFFCB] bg-clip-text text-transparent">
                Simplified
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              The elegant platform for managing leagues, schools, and athletic events.
              <br />
              <span className="text-slate-400">Request. Approve. Schedule. Done.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => document.getElementById('waitlist').scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-[#2FFFCB] to-cyan-400 text-slate-900 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg px-8 py-6 rounded-2xl font-semibold"
              >
                Join Waitlist
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => base44.auth.redirectToLogin()}
                className="border-2 border-slate-700 hover:border-[#2FFFCB] hover:bg-[#2FFFCB]/5 text-white text-lg px-8 py-6 rounded-2xl font-semibold"
              >
                Sign In
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-slate-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-slate-800 text-slate-300 border-slate-700">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need
            </h2>
            <p className="text-xl text-slate-300">
              Built for the modern athletic department
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-slate-900/50 backdrop-blur-sm hover:scale-105">
                  <CardContent className="p-8">
                    <div className={`bg-gradient-to-r ${feature.gradient} p-3 rounded-2xl w-fit mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple workflow
            </h2>
            <p className="text-xl text-slate-300">
              From request to assignment in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", icon: Calendar, title: "Browse Events", desc: "Officials find games that match their schedule and qualifications" },
              { step: "2", icon: CheckCircle, title: "Request to Work", desc: "Submit a request with one click. ADs review and approve instantly" },
              { step: "3", icon: Zap, title: "Get Assigned", desc: "Receive confirmation, game details, and directions automatically" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="bg-gradient-to-r from-[#2FFFCB] to-cyan-400 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-slate-900 mx-auto mb-4 shadow-xl">
                  {item.step}
                </div>
                <div className="bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-800">
                  <item.icon className="w-8 h-8 text-white mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-300">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#2FFFCB] to-cyan-400" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Form */}
      <section id="waitlist" className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-800">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-[#2FFFCB] to-cyan-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CircleDot className="w-8 h-8 text-slate-900" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Join the Waitlist
                  </h2>
                  <p className="text-slate-300">
                    Be among the first to revolutionize your sports management
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-300">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="border-slate-700 bg-slate-800/50 text-white focus:border-[#2FFFCB] focus:ring-[#2FFFCB] rounded-xl"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="border-slate-700 bg-slate-800/50 text-white focus:border-[#2FFFCB] focus:ring-[#2FFFCB] rounded-xl"
                        placeholder="john@school.edu"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization" className="text-slate-300">School or Organization</Label>
                    <Input
                      id="organization"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="border-slate-700 bg-slate-800/50 text-white focus:border-[#2FFFCB] focus:ring-[#2FFFCB] rounded-xl"
                      placeholder="Lincoln High School"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-slate-300">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="border-slate-700 bg-slate-800/50 text-white focus:border-[#2FFFCB] focus:ring-[#2FFFCB] rounded-xl"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-slate-300">Your Role *</Label>
                      <Select
                        required
                        value={formData.role}
                        onValueChange={(value) => setFormData({ ...formData, role: value })}
                      >
                        <SelectTrigger className="border-slate-700 bg-slate-800/50 text-white focus:border-[#2FFFCB] focus:ring-[#2FFFCB] rounded-xl">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                          <SelectItem value="athletic_director">Athletic Director</SelectItem>
                          <SelectItem value="coach">Coach</SelectItem>
                          <SelectItem value="official">Official</SelectItem>
                          <SelectItem value="administrator">Administrator</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-300">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="border-slate-700 bg-slate-800/50 text-white focus:border-[#2FFFCB] focus:ring-[#2FFFCB] rounded-xl resize-none"
                      rows={3}
                      placeholder="Tell us about your needs..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#2FFFCB] to-cyan-400 text-slate-900 hover:shadow-xl transition-all duration-300 text-lg py-6 rounded-xl font-semibold"
                  >
                    {isSubmitting ? "Joining..." : "Join Waitlist"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <p className="text-xs text-center text-slate-400">
                    We'll never share your information. You can unsubscribe anytime.
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
