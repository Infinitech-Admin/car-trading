// app/admin/page.tsx

"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Car,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Users,
  Warehouse,
} from "lucide-react";
import type { ReactNode } from "react";

interface RevenuePoint {
  month: string;
  revenue: number;
  unitsSold: number;
}

const REVENUE_DATA: RevenuePoint[] = [
  { month: "Apr", revenue: 4_120_000, unitsSold: 18 },
  { month: "May", revenue: 4_680_000, unitsSold: 21 },
  { month: "Jun", revenue: 3_950_000, unitsSold: 16 },
  { month: "Jul", revenue: 5_230_000, unitsSold: 24 },
  { month: "Aug", revenue: 5_890_000, unitsSold: 27 },
  { month: "Sep", revenue: 6_410_000, unitsSold: 30 },
];

interface CategorySlice {
  name: string;
  value: number;
}

const CATEGORY_DATA: CategorySlice[] = [
  { name: "Sedan", value: 38 },
  { name: "SUV", value: 27 },
  { name: "Pickup", value: 18 },
  { name: "Hatchback", value: 10 },
  { name: "Van", value: 7 },
];

const CATEGORY_COLORS = ["#d9ae1f", "#3b82f6", "#22c55e", "#ec4899", "#a855f7"];

interface TopModel {
  model: string;
  unitsSold: number;
}

const TOP_MODELS: TopModel[] = [
  { model: "Vios", unitsSold: 34 },
  { model: "Fortuner", unitsSold: 29 },
  { model: "Ranger", unitsSold: 22 },
  { model: "Civic", unitsSold: 19 },
  { model: "CX-5", unitsSold: 14 },
];

interface RecentActivity {
  id: string;
  customer: string;
  vehicle: string;
  amount: string;
  status: "Completed" | "Pending" | "Reserved";
  date: string;
}

const RECENT_ACTIVITY: RecentActivity[] = [
  {
    id: "ORD-1042",
    customer: "Marco Villanueva",
    vehicle: "2024 Toyota Fortuner",
    amount: "₱1,850,000",
    status: "Completed",
    date: "Sep 24",
  },
  {
    id: "ORD-1041",
    customer: "Anna Reyes",
    vehicle: "2023 Honda Civic RS",
    amount: "₱1,420,000",
    status: "Pending",
    date: "Sep 23",
  },
  {
    id: "ORD-1040",
    customer: "Paolo Santos",
    vehicle: "2024 Ford Ranger Wildtrak",
    amount: "₱2,150,000",
    status: "Reserved",
    date: "Sep 22",
  },
  {
    id: "ORD-1039",
    customer: "Kristine Cruz",
    vehicle: "2023 Toyota Vios XLE",
    amount: "₱980,000",
    status: "Completed",
    date: "Sep 21",
  },
  {
    id: "ORD-1038",
    customer: "Jomari Torres",
    vehicle: "2024 Mazda CX-5",
    amount: "₱1,690,000",
    status: "Pending",
    date: "Sep 20",
  },
];

const STATUS_STYLES: Record<RecentActivity["status"], string> = {
  Completed: "bg-emerald-500/10 text-emerald-400",
  Pending: "bg-amber-500/10 text-amber-400",
  Reserved: "bg-blue-500/10 text-blue-400",
};

function formatPeso(value: number): string {
  return `₱${(value / 1_000_000).toFixed(1)}M`;
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white sm:text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Overview of sales, inventory, and activity.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total revenue"
          value="₱30.3M"
          change="+12.4%"
          trend="up"
          icon={<DollarSign size={18} />}
        />
        <StatCard
          label="Vehicles sold"
          value="136"
          change="+8.1%"
          trend="up"
          icon={<Car size={18} />}
        />
        <StatCard
          label="Active listings"
          value="82"
          change="-3.2%"
          trend="down"
          icon={<Warehouse size={18} />}
        />
        <StatCard
          label="New inquiries"
          value="214"
          change="+21.7%"
          trend="up"
          icon={<Users size={18} />}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard
          title="Revenue &amp; units sold"
          subtitle="Last 6 months"
          className="xl:col-span-2"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart
              data={REVENUE_DATA}
              margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d9ae1f" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#d9ae1f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#ffffff14" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatPeso}
              />
              <Tooltip
                contentStyle={{
                  background: "#232b3d",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  color: "#fff",
                  fontSize: 13,
                }}
              formatter={(value, name) => {
  const numericValue =
    typeof value === "number" ? value : Number(value);
  return name === "revenue"
    ? [formatPeso(numericValue), "Revenue"]
    : [String(numericValue), "Units sold"];
}}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#d9ae1f"
                strokeWidth={2}
                fill="url(#revenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Inventory by category" subtitle="Current mix">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={CATEGORY_DATA}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
              >
                {CATEGORY_DATA.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#232b3d",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  color: "#fff",
                  fontSize: 13,
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: 12, color: "#94a3b8" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Second row: top models + recent activity */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard
          title="Top-selling models"
          subtitle="Units sold, last 30 days"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={TOP_MODELS}
              layout="vertical"
              margin={{ top: 4, right: 12, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="#ffffff14" horizontal={false} />
              <XAxis
                type="number"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="model"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={70}
              />
              <Tooltip
                contentStyle={{
                  background: "#232b3d",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  color: "#fff",
                  fontSize: 13,
                }}
              />
              <Bar
                dataKey="unitsSold"
                fill="#d9ae1f"
                radius={[0, 6, 6, 0]}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="rounded-2xl border border-white/10 bg-[#232b3d]/70 p-4 sm:p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Recent activity
              </h2>
              <p className="text-xs text-slate-400">
                Latest orders and reservations
              </p>
            </div>
            <button className="text-xs font-medium text-[#d9ae1f] hover:text-[#f4c430]">
              View all
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-2 pr-4 font-medium">Order</th>
                  <th className="pb-2 pr-4 font-medium">Customer</th>
                  <th className="pb-2 pr-4 font-medium">Vehicle</th>
                  <th className="pb-2 pr-4 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ACTIVITY.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="py-2.5 pr-4 text-slate-300">{row.id}</td>
                    <td className="py-2.5 pr-4 text-white">{row.customer}</td>
                    <td className="py-2.5 pr-4 text-slate-400">
                      {row.vehicle}
                    </td>
                    <td className="py-2.5 pr-4 text-white">{row.amount}</td>
                    <td className="py-2.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[row.status]}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  change,
  trend,
  icon,
}: {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#232b3d]/70 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d9ae1f]/10 text-[#d9ae1f]">
          {icon}
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span
          className={`flex items-center gap-1 text-xs font-semibold ${
            trend === "up" ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {trend === "up" ? (
            <TrendingUp size={13} />
          ) : (
            <TrendingDown size={13} />
          )}
          {change}
        </span>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  className = "",
  children,
}: {
  title: string;
  subtitle: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#232b3d]/70 p-4 sm:p-5 ${className}`}
    >
      <div className="mb-2">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
