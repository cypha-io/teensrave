"use client";

import {
  Calendar,
  CalendarCog,
  Home,
  Inbox,
  LayoutDashboard,
  List,
  NotebookTabs,
  Search,
  Settings,
  UserPen,
  UserPlus,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const [selectedItem, setSelectedItem] = useState("dashboard");
  const navItems = [
    {
      title: "MANAGEMENT",
      group: [
        { ref: "Products", refLink: "/products", icon: List },
        { ref: "Orders", refLink: "/orders", icon: UserPlus },
        { ref: "Account", refLink: "/account", icon: UserPlus },
      ],
    },
  ];
  const pathname = usePathname();

  return (
    <Sidebar className="">
      <SidebarHeader className="py-8">
        <Image
          src="/logo.png"
          alt="mystery embassy"
          className="max-w-[150px] mx-auto"
          width={100}
          height={70}
        />
      </SidebarHeader>
      <SidebarContent className="">
        {navItems.map((singleItem) => (
          <SidebarGroup key={singleItem.title}>
            <SidebarGroupLabel className="uppercase text-[.9rem] text-gray-400">
              {singleItem.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {singleItem.group.map((item) => (
                <SidebarMenuItem
                  key={item.ref}
                  className={`rounded-lg font-semibold ${
                    pathname === item.refLink
                      ? "text-[#518fff] bg-sidebar-accent"
                      : ""
                  }`}
                >
                  <SidebarMenuButton
                    asChild
                    className="rounded-lg px-2 text-[1rem]! capitalize "
                  >
                    <Link href={item.refLink} className=" py-5 ">
                      <item.icon />
                      <span>{item.ref}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        {/* <SidebarGroup>
          <SidebarGroupContent>
            
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>
    </Sidebar>
  );
}
