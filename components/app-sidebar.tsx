"use client";

import {
  User,
  Mail,
  LayoutDashboard,
  Music,
  Camera,
  Newspaper,
  MessageSquare,
  ShoppingBasket,
  Image as ImageIcon,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call logout API to clear server-side session
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout API error:", error);
    }

    // Clear client-side authentication data
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("admin_token");

    // Redirect to login
    router.push("/admin/login");
  };

  const dashboardItems = [
    {
      ref: "Overview",
      refLink: "/admin/dashboard/overview",
      icon: LayoutDashboard,
      isActive: pathname === "/admin/dashboard/overview",
    },
    {
      ref: "Artiste",
      refLink: "/admin/dashboard/artists",
      icon: Music,
      isActive: pathname === "/admin/dashboard/artists",
    },
    {
      ref: "Media",
      icon: Camera,
      isActive: pathname === "/admin/dashboard/media",
      refLink: "/admin/dashboard/media",
    },
    {
      ref: "Newsletter",
      icon: Mail,
      isActive: pathname === "/admin/dashboard/newsletter",
      refLink: "/admin/dashboard/newsletter",
    },
    {
      ref: "Support",
      icon: MessageSquare,
      isActive: pathname === "/admin/dashboard/support",
      refLink: "/admin/dashboard/support",
    },
    {
      ref: "Shop",
      icon: ShoppingBasket,
      isActive: pathname === "/admin/dashboard/shop",
      refLink: "/admin/dashboard/shop",
    },
    {
      ref: "News",
      icon: Newspaper,
      isActive: pathname === "/admin/dashboard/news",
      refLink: "/admin/dashboard/news",
    },
    {
      ref: "Gallery",
      icon: ImageIcon,
      isActive: pathname === "/admin/dashboard/gallery",
      refLink: "/admin/dashboard/gallery",
    },
  ];

  return (
    <Sidebar className="bg-white border-r border-gray-200">
      <SidebarHeader className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Image
              src={"/logo.png"}
              priority
              alt="teensrave"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">TeensRave</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-2">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {dashboardItems.map((item) => (
                <SidebarMenuItem key={item.ref}>
                  <SidebarMenuButton
                    asChild
                    className={`group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    isActive={item.isActive}
                  >
                    <Link href={item.refLink} className="flex items-center gap-3 w-full">
                      <item.icon className={`w-5 h-5 ${
                        item.isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                      }`} />
                      <span>{item.ref}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        <div className="mt-auto px-3">
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 mb-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
