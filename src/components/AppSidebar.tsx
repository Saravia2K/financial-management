"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Tags,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Incomes", url: "/dashboard/incomes", icon: TrendingUp },
  { title: "Expenses", url: "/dashboard/expenses", icon: TrendingDown },
  { title: "Categories", url: "/dashboard/categories", icon: Tags },
  { title: "Sign out", url: "/auth/logout", icon: LogOut },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const pathname = usePathname();
  const isCollapsed = state === "collapsed";

  // Emula NavLink + end={url === "/dashboard"}
  const isActive = (url: string) => {
    const exact = url === "/dashboard";
    return exact ? pathname === url : pathname.startsWith(url);
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-finance-primary font-semibold">
            FinanceTracker
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const active = isActive(item.url);
                const linkCls = clsx(
                  "flex items-center",
                  active
                    ? "bg-finance-primary/10 text-finance-primary font-medium border-r-2 border-finance-primary"
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                );

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        aria-current={active ? "page" : undefined}
                        className={linkCls}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
