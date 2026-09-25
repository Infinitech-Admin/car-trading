// app/admin/layout.tsx

"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Car,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Search,
  Settings,
  ShoppingCart,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import { fetchMe, logout, type AuthUser } from "@/lib/api";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  soon?: boolean;
}

function getInitials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const initials =
    parts.length === 1
      ? parts[0].slice(0, 2)
      : parts[0][0] + parts[parts.length - 1][0];
  return initials.toUpperCase();
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Showroom", href: "/admin/showroom", icon: Warehouse },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart, soon: true },
  { label: "Customers", href: "/admin/customers", icon: Users, soon: true },
  { label: "Settings", href: "/admin/settings", icon: Settings, soon: true },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authState, setAuthState] = useState<"checking" | "authenticated">(
    "checking",
  );
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchMe({ signal: controller.signal })
      .then(({ user }) => {
        setUser(user);
        setAuthState("authenticated");
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      });

    return () => {
      controller.abort();
    };
    // Re-check whenever the admin section is entered on a new path so a
    // session that expired mid-session still gets caught.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      router.replace("/login");
    }
  }

  if (authState === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#171c28]">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Loader2 size={18} className="animate-spin text-[#d9ae1f]" />
          Checking session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171c28] text-white">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#1a2332] transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-lg font-black text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#BF980D]/15 text-[#d9ae1f]">
              <Car size={17} />
            </span>
            Auto<span className="text-[#d9ae1f]">Trade</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            if (item.soon) {
              return (
                <div
                  key={item.href}
                  className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2.5 text-sm text-slate-600"
                  title="Coming soon"
                >
                  <span className="flex items-center gap-3">
                    <Icon size={17} />
                    {item.label}
                  </span>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-500">
                    Soon
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#d9ae1f]/10 text-[#d9ae1f]"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/10 bg-[#171c28]/90 px-4 backdrop-blur sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-300 hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="relative hidden flex-1 max-w-sm sm:block">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search vehicles, orders..."
              className="w-full rounded-lg border border-white/10 bg-[#232b3d]/70 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#d9ae1f]/60"
            />
          </div>

          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            <button
              className="relative text-slate-300 hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#d9ae1f]" />
            </button>
            <div className="flex items-center gap-2">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold leading-tight text-white">
                  {user?.name ?? "..."}
                </p>
                <p className="text-[11px] capitalize leading-tight text-slate-400">
                  {user?.role ?? ""}
                </p>
              </div>
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d9ae1f]/15 text-xs font-bold text-[#d9ae1f]"
                title={user?.email}
              >
                {getInitials(user?.name)}
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
