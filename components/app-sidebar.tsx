"use client";

import {
  ShoppingCart,
  Rocket,
  Megaphone,
  BarChart3,
  Sparkles,
  Building,
  User,
  Package,
  ShoppingBasket,
  UserCircle,
  HelpCircle,
  Calendar,
  ChevronDown,
  Folder,
  Mail,
  LayoutDashboard,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function AppSidebar() {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (item: string) => {
    setOpenItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const dashboardItems = [
    {
      ref: "Overview",
      refLink: "/admin/dashboard/overview",
      icon: LayoutDashboard,
      isActive: pathname === "/admin/dashboard/overview",
    },
    {
      ref: "Products",
      icon: Package,
      isActive: pathname === "/admin/dashboard/products/list",

      refLink: "/admin/dashboard/products/list",
    },
    {
      ref: "Orders",
      icon: ShoppingBasket,
      isActive: pathname === "/admin/dashboard/orders/list",

      refLink: "/admin/dashboard/orders/list",
    },
    {
      ref: "Account",
      icon: UserCircle,
      isActive: pathname === "/admin/dashboard/account/settings",

      refLink: "/admin/dashboard/account/settings",
    },
    {
      ref: "Mail",
      icon: Mail,
      isActive: pathname === "/admin/dashboard/mail",

      refLink: "/admin/dashboard/mail",
    },
  ];

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="py-6 px-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Image
            src={"/logo.png"}
            priority
            alt="teensrave"
            width={100}
            height={70}
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-xs text-gray-500 px-4 mb-2">
            DASHBOARD
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardItems.map((item) => (
                <SidebarMenuItem
                  key={item.ref}
                  className={`rounded-lg mx-2 ${
                    item.isActive
                      ? "text-[#518fff] bg-[#e4e4e7]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <SidebarMenuButton
                    asChild
                    className="rounded-lg px-4 text-sm font-medium"
                    isActive={item.isActive}
                  >
                    <Link href={item.refLink}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.ref}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
