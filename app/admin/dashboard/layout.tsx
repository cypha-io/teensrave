"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Bell, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

const Layout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
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

  return (
    <SidebarProvider className="h-screen">
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-4 bg-white z-10">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-4">
            {/* Flag icon */}
            <div className="w-6 h-6 flex items-center justify-center">
              <span className="text-lg">🇺🇸</span>
            </div>
            {/* Bell icon */}
            <button
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            {/* Settings icon */}
            <button
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            {/* Logout icon */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
            {/* Profile picture */}
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
              <Image
                src="/api/placeholder/32/32"
                alt="Profile"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
