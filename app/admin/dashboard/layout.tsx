import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { ReactNode } from "react";

const Layout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <section className=" w-full">
        <SidebarTrigger />

        <div>{children}</div>
      </section>
    </SidebarProvider>
  );
};

export default Layout;
