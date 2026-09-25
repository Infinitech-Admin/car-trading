"use client";

import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Car,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  deleteVehicle,
  fetchAdminVehicles,
  resolveMediaUrl,
  type ApiError,
  type Vehicle,
} from "@/lib/api";
import VehicleFormDrawer from "@/components/admin/vehicle-formDrawer";

const STATUS_FILTERS: Array<"All" | Vehicle["status"]> = [
  "All",
  "available",
  "reserved",
  "sold",
];

const STATUS_STYLES: Record<Vehicle["status"], string> = {
  available: "bg-emerald-500/10 text-emerald-400",
  reserved: "bg-blue-500/10 text-blue-400",
  sold: "bg-slate-500/15 text-slate-400",
};

const STATUS_LABELS: Record<Vehicle["status"], string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

export default function ShowroomClient({
  imageBaseUrl,
}: {
  imageBaseUrl: string;
}) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Vehicle["status"]>(
    "All",
  );
  const [drawerVehicle, setDrawerVehicle] = useState<
    Vehicle | null | undefined
  >(undefined);
  const [menu, setMenu] = useState<{
    vehicle: Vehicle;
    top: number;
    left: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await fetchAdminVehicles();
      setVehicles(data);
    } catch (err) {
      setError((err as ApiError).message || "Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Close the row menu on scroll/resize so it never ends up pointing at
  // the wrong row, since its position is a one-time snapshot of the
  // button's screen coordinates rather than something that tracks layout.
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [menu]);

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.type.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || v.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [vehicles, search, statusFilter]);

  function toggleMenu(
    vehicle: Vehicle,
    e: React.MouseEvent<HTMLButtonElement>,
  ) {
    if (menu?.vehicle.id === vehicle.id) {
      setMenu(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const MENU_WIDTH = 128; // matches w-32 below
    setMenu({
      vehicle,
      top: rect.bottom + 4,
      left: Math.min(
        rect.right - MENU_WIDTH,
        window.innerWidth - MENU_WIDTH - 8,
      ),
    });
  }

  async function handleDelete(vehicle: Vehicle) {
    if (!confirm(`Delete "${vehicle.name}"? This can't be undone.`)) return;
    try {
      await deleteVehicle(vehicle.id);
      setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
    } catch (err) {
      alert((err as ApiError).message || "Failed to delete vehicle.");
    }
    setMenu(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">Showroom</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage vehicle listings and stock.
          </p>
        </div>
        <button
          onClick={() => setDrawerVehicle(null)}
          className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d9ae1f] to-[#f4c430] px-5 py-2.5 text-sm font-bold text-[#171c28] transition-all hover:brightness-105"
        >
          <Plus size={16} />
          Add vehicle
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by model or type..."
            className="w-full rounded-xl border border-white/10 bg-[#232b3d]/70 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-[#d9ae1f]/60"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <SlidersHorizontal
            size={15}
            className="hidden shrink-0 text-slate-500 sm:block"
          />
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                statusFilter === status
                  ? "bg-[#d9ae1f]/15 text-[#d9ae1f]"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-[#232b3d]/70 py-16 text-sm text-slate-400">
          <Loader2 size={18} className="mr-2 animate-spin text-[#d9ae1f]" />
          Loading vehicles...
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-500">
            {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} found
          </p>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-[#232b3d]/70 lg:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-medium">Vehicle</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Mileage</th>
                  <th className="px-5 py-3 font-medium">Stock</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr
                    key={v.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#d9ae1f]/15 text-[#d9ae1f]">
                          {v.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={resolveMediaUrl(v.image, imageBaseUrl)}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Car size={16} />
                          )}
                        </span>
                        <div>
                          <p className="font-medium text-white">{v.name}</p>
                          <p className="text-xs text-slate-500">{v.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-400">{v.type}</td>
                    <td className="px-5 py-3 text-white">{v.price}</td>
                    <td className="px-5 py-3 text-slate-400">{v.mileage}</td>
                    <td className="px-5 py-3 text-slate-400">{v.stock}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[v.status]}`}
                      >
                        {STATUS_LABELS[v.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={(e) => toggleMenu(v, e)}
                        className="text-slate-500 hover:text-white"
                        aria-label="More options"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      No vehicles match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile / tablet cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
            {filtered.map((v) => (
              <div
                key={v.id}
                className="rounded-2xl border border-white/10 bg-[#232b3d]/70 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#d9ae1f]/15 text-[#d9ae1f]">
                      {v.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolveMediaUrl(v.image, imageBaseUrl)}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Car size={18} />
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {v.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {v.type} · {v.year}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => toggleMenu(v, e)}
                    className="text-slate-500 hover:text-white"
                    aria-label="More options"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-semibold text-white">{v.price}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[v.status]}`}
                  >
                    {STATUS_LABELS[v.status]}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{v.mileage}</span>
                  <span>{v.stock} in stock</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full rounded-2xl border border-white/10 bg-[#232b3d]/70 py-10 text-center text-sm text-slate-500">
                No vehicles match your search.
              </div>
            )}
          </div>
        </>
      )}

      {menu && (
        <>
          {/* Transparent overlay to catch outside clicks; sits below the
              menu itself and above everything else, and is unaffected by
              any ancestor's overflow-hidden since it's fixed to the
              viewport rather than nested in the table. */}
          <div className="fixed inset-0 z-40" onClick={() => setMenu(null)} />
          <div
            className="fixed z-50 w-32 overflow-hidden rounded-xl border border-white/10 bg-[#1a2332] shadow-xl"
            style={{ top: menu.top, left: menu.left }}
          >
            <button
              onClick={() => {
                setDrawerVehicle(menu.vehicle);
                setMenu(null);
              }}
              className="block w-full px-3.5 py-2.5 text-left text-xs text-slate-300 hover:bg-white/5 hover:text-white"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(menu.vehicle)}
              className="block w-full px-3.5 py-2.5 text-left text-xs text-red-400 hover:bg-red-500/10"
            >
              Delete
            </button>
          </div>
        </>
      )}

      {drawerVehicle !== undefined && (
        <VehicleFormDrawer
          vehicle={drawerVehicle ?? undefined}
          imageBaseUrl={imageBaseUrl}
          onClose={() => {
            setDrawerVehicle(undefined);
            load();
          }}
          onSaved={load}
        />
      )}
    </div>
  );
}
