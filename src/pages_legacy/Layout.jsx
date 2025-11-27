
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
// Legacy file - base44 removed
import {
  Home,
  Calendar,
  Users,
  UserCircle,
  Shield,
  Menu,
  CircleDot,
  LogOut,
  Bell,
  Settings
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Layout({ children, currentPageName }) {
  const location = useLocation(); */
  const navigate = useNavigate(); */
  const [user, setUser] = useState(null); */
  const [mobileOpen, setMobileOpen] = useState(false); */
  const [isPublicPage, setIsPublicPage] = useState(false); */

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await /* base44 removed */auth.isAuthenticated(); */
        if (isAuth) {
          const currentUser = await /* base44 removed */auth.me(); */
          setUser(currentUser); */
        }
      } catch (error) {
        console.log("Not authenticated"); */
      }
    };
    
    setIsPublicPage(currentPageName === "Landing"); */
    
    if (!isPublicPage) {
      checkAuth(); */
    }
  }, [currentPageName]); */

  const handleLogout = async () => {
    await /* base44 removed */auth.logout(createPageUrl("Landing")); */
  };

  const isAdmin = user?.app_role === 'super_admin' || user?.app_role === 'admin';

  const navigation = [
    { name: "Dashboard", href: createPageUrl("Dashboard"), icon: Home, show: !!user },
    { name: "Events", href: createPageUrl("Events"), icon: Calendar, show: !!user },
    { name: "Officials", href: createPageUrl("Officials"), icon: Users, show: !!user },
    { name: "Admin", href: createPageUrl("Admin"), icon: Shield, show: isAdmin },
  ];

  const visibleNav = navigation.filter(item => item.show); */

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {children}
      </div>
    ); */
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to={createPageUrl("Dashboard")} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#2FFFCB] to-cyan-400 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative bg-gradient-to-r from-[#2FFFCB] to-cyan-400 p-2 rounded-2xl">
                  <CircleDot className="w-6 h-6 text-slate-900" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  The Official App
                </h1>
                <p className="text-xs text-slate-400">The Official App</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {visibleNav.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#2FFFCB]/10 text-[#2FFFCB]"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ); */
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-800">
                    <Bell className="w-5 h-5 text-slate-400" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="rounded-full p-0 h-10 w-10">
                        <Avatar className="h-10 w-10 border-2 border-[#2FFFCB]">
                          <AvatarImage src={user.image} />
                          <AvatarFallback className="bg-gradient-to-r from-[#2FFFCB] to-cyan-400 text-slate-900 font-semibold">
                            {user.full_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800">
                      <DropdownMenuLabel>
                        <div>
                          <p className="font-medium text-white">{user.full_name}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                          <Badge variant="secondary" className="mt-1 text-xs bg-slate-800 text-slate-300">
                            {user.app_role?.replace('_', ' ')}
                          </Badge>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-slate-800" />
                      <DropdownMenuItem onClick={() => navigate(createPageUrl("Profile"))} className="text-slate-300 hover:bg-slate-800 hover:text-white">
                        <UserCircle className="w-4 h-4 mr-2" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(createPageUrl("Settings"))} className="text-slate-300 hover:bg-slate-800 hover:text-white">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-800" />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:bg-slate-800 hover:text-red-300">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button onClick={() => /* base44 removed */auth.redirectToLogin()} className="bg-[#2FFFCB] text-slate-900 hover:bg-cyan-400">
                  Sign In
                </Button>
              )}

              {/* Mobile Menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="hover:bg-slate-800">
                    <Menu className="w-6 h-6 text-slate-400" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 bg-slate-900 border-slate-800">
                  <nav className="flex flex-col gap-2 mt-8">
                    {visibleNav.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            isActive
                              ? "bg-[#2FFFCB]/10 text-[#2FFFCB]"
                              : "text-slate-400 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          {item.name}
                        </Link>
                      ); */
                    })}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <CircleDot className="w-5 h-5 text-[#2FFFCB]" />
              <p className="text-sm text-slate-400">
                © 2025 The Official App. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <Link to="#" className="text-sm text-slate-400 hover:text-white">
                Privacy
              </Link>
              <Link to="#" className="text-sm text-slate-400 hover:text-white">
                Terms
              </Link>
              <Link to="#" className="text-sm text-slate-400 hover:text-white">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  ); */
}
