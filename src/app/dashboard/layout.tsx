"use client";

import TopNav from "@/components/global/TopNav";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  HomeIcon,
  UserIcon,
  ZapIcon,
  ClipboardListIcon,
  CreditCardIcon,
  LogOutIcon,
  DollarSignIcon,
  FileTextIcon,
  AlertCircleIcon,
  BarChart3,
  ActivityIcon,
  UserXIcon,
  TrendingUpIcon,
  TrophyIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const TITLE_MAP: Record<string, string> = {
  "/dashboard/admin": "Admin dashboard",
  "/dashboard/admin/users": "Users",
  "/dashboard/admin/users/add": "Add user",
  "/dashboard/admin-staff": "Staff dashboard",
  "/dashboard/admin-staff/customers": "Customers",
  "/dashboard/admin-staff/customers/add": "Add customer",
  "/dashboard/admin-staff/meters": "Meters",
  "/dashboard/admin-staff/meters/add": "Add meter",
  "/dashboard/admin-staff/meters/assign": "Assign meter",
  "/dashboard/admin-staff/meter-readers": "Meter readers",
  "/dashboard/admin-staff/meter-readers/assign": "Assign meter reader",
  "/dashboard/admin-staff/tariffs": "Tariffs",
  "/dashboard/admin-staff/tariffs/add": "Add tariff",
  "/dashboard/admin-staff/complaints": "Complaints",
  "/dashboard/billing": "Bills",
  "/dashboard/billing/outstanding": "Outstanding bills",
  "/dashboard/billing/summary": "Billing summary",
  "/dashboard/manager": "Manager dashboard",
  "/dashboard/manager/consumption": "Consumption",
  "/dashboard/manager/defaulters": "Defaulters",
  "/dashboard/manager/payments": "Payments",
  "/dashboard/manager/revenue": "Revenue",
  "/dashboard/manager/top-consumers": "Top consumers",
  "/dashboard/meter-reader": "Assigned meters",
  "/dashboard/meter-reader/add": "Add reading",
  "/dashboard/customer": "Customer dashboard",
  "/dashboard/customer/bills": "My bills",
  "/dashboard/customer/meters": "My meters",
  "/dashboard/customer/complaints": "Complaints",
  "/dashboard/customer/complaints/new": "New complaint",
};

function resolveTitle(pathname: string) {
  if (TITLE_MAP[pathname]) return TITLE_MAP[pathname];
  if (pathname.includes("/users/") && pathname.endsWith("/edit")) return "Edit user";
  if (pathname.includes("/customers/") && pathname.endsWith("/edit")) return "Edit customer";
  if (pathname.includes("/tariffs/") && pathname.endsWith("/edit")) return "Edit tariff";
  if (pathname.includes("/billing/bills/")) return "Bill detail";
  if (pathname.includes("/billing/payments/add/")) return "Record payment";
  if (pathname.includes("/billing/payments/history/")) return "Payment history";
  if (pathname.includes("/complaints/") && !pathname.endsWith("/new")) return "Complaint detail";
  if (pathname.includes("/readings/history/")) return "Reading history";
  if (pathname.includes("/readings/")) return "Add reading";
  const segment = pathname.split("/").filter(Boolean).pop() || "Dashboard";
  return segment
    .replace(/-/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const adminMenu = [
    { label: "Dashboard", icon: HomeIcon, href: "/dashboard/admin" },
    { label: "Users", icon: UserIcon, href: "/dashboard/admin/users" },
  ];

  const adminStaffMenu = [
    { label: "Dashboard", icon: HomeIcon, href: "/dashboard/admin-staff" },
    { label: "Customers", icon: UserIcon, href: "/dashboard/admin-staff/customers" },
    { label: "Meters", icon: ZapIcon, href: "/dashboard/admin-staff/meters" },
    { label: "Meter readers", icon: ClipboardListIcon, href: "/dashboard/admin-staff/meter-readers" },
    { label: "Tariffs", icon: DollarSignIcon, href: "/dashboard/admin-staff/tariffs" },
    { label: "Complaints", icon: AlertCircleIcon, href: "/dashboard/admin-staff/complaints" },
  ];

  const meterReaderMenu = [
    { label: "Dashboard", icon: HomeIcon, href: "/dashboard/meter-reader" },
  ];

  const billingMenu = [
    { label: "Dashboard", icon: HomeIcon, href: "/dashboard/billing" },
    { label: "Outstanding", icon: AlertCircleIcon, href: "/dashboard/billing/outstanding" },
    { label: "Summary", icon: BarChart3, href: "/dashboard/billing/summary" },
  ];

  const managerMenu = [
    { label: "Dashboard", icon: HomeIcon, href: "/dashboard/manager" },
    { label: "Consumption", icon: ActivityIcon, href: "/dashboard/manager/consumption" },
    { label: "Defaulters", icon: UserXIcon, href: "/dashboard/manager/defaulters" },
    { label: "Payments", icon: CreditCardIcon, href: "/dashboard/manager/payments" },
    { label: "Revenue", icon: TrendingUpIcon, href: "/dashboard/manager/revenue" },
    { label: "Top consumers", icon: TrophyIcon, href: "/dashboard/manager/top-consumers" },
  ];

  const customerMenu = [
    { label: "Dashboard", icon: HomeIcon, href: "/dashboard/customer" },
    { label: "My bills", icon: FileTextIcon, href: "/dashboard/customer/bills" },
    { label: "My meters", icon: ZapIcon, href: "/dashboard/customer/meters" },
    { label: "Complaints", icon: AlertCircleIcon, href: "/dashboard/customer/complaints" },
  ];

  function getMenu() {
    if (pathname.startsWith("/dashboard/admin-staff")) return adminStaffMenu;
    if (pathname.startsWith("/dashboard/admin")) return adminMenu;
    if (pathname.startsWith("/dashboard/meter-reader")) return meterReaderMenu;
    if (pathname.startsWith("/dashboard/billing")) return billingMenu;
    if (pathname.startsWith("/dashboard/manager")) return managerMenu;
    if (pathname.startsWith("/dashboard/customer")) return customerMenu;
    return [];
  }

  function handleLogout() {
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  }

  const menu = getMenu();
  const title = resolveTitle(pathname);

  return (
    <SidebarProvider>
      <div className="flex min-h-dvh w-full bg-background">
        <Sidebar collapsible="icon" className="border-r border-border/80 bg-sidebar">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>
                <span className="text-lg font-semibold tracking-tight text-primary">
                  Enerlytics
                </span>
              </SidebarGroupLabel>

              <SidebarMenu className="mt-4">
                {menu.map((item) => (
                  <SidebarMenuItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup className="mt-auto mb-8">
              <SidebarMenu>
                <SidebarMenuItem
                  icon={LogOutIcon}
                  label="Logout"
                  onClick={handleLogout}
                />
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav title={title} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
