"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Check, Loader2, Trash2, UploadCloud, X } from "lucide-react";
import {
  addVehicleMedia,
  createVehicle,
  deleteVehicleMedia,
  resolveMediaUrl,
  updateVehicle,
  uploadFileInChunks,
  type ApiError,
  type GalleryMediaItem,
  type Vehicle,
  type VehiclePayload,
} from "@/lib/api";

const VEHICLE_TYPES = ["Sedan", "SUV", "Pickup", "Hatchback", "Van", "Coupe"];
const STATUS_OPTIONS: VehiclePayload["status"][] = [
  "available",
  "reserved",
  "sold",
];

const STEPS = [
  { id: 1, label: "Basic info" },
  { id: 2, label: "Specs" },
  { id: 3, label: "Media" },
] as const;

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#171c28]/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-[#d9ae1f]/60";

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </label>
      {children}
    </div>
  );
}

interface FormState {
  name: string;
  year: string;
  type: string;
  mileage_km: string;
  engine: string;
  horsepower: string;
  transmission: string;
  price: string;
  location: string;
  fuel: string;
  badge: string;
  description: string;
  stock: string;
  status: VehiclePayload["status"];
}

function toFormState(v?: Vehicle): FormState {
  return {
    name: v?.name ?? "",
    year: v?.year ?? String(new Date().getFullYear()),
    type: v?.type ?? "Sedan",
    mileage_km: v ? String(v.mileage_km) : "0",
    engine: v?.engine ?? "",
    horsepower: v?.horsepower ?? "",
    transmission: v?.transmission ?? "Automatic",
    price: v ? String(v.price_value) : "",
    location: v?.location ?? "",
    fuel: v?.fuel ?? "Petrol",
    badge: v?.badge ?? "",
    description: v?.description ?? "",
    stock: v ? String(v.stock) : "1",
    status: v?.status ?? "available",
  };
}

export default function VehicleFormDrawer({
  vehicle,
  imageBaseUrl,
  onClose,
  onSaved,
}: {
  vehicle?: Vehicle;
  imageBaseUrl: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(() => toFormState(vehicle));
  const [savedVehicle, setSavedVehicle] = useState<Vehicle | undefined>(
    vehicle,
  );
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    vehicle?.image ? resolveMediaUrl(vehicle.image, imageBaseUrl) : null,
  );
  const [imageUploadPercent, setImageUploadPercent] = useState<number | null>(
    null,
  );
  const [gallery, setGallery] = useState<GalleryMediaItem[]>(
    vehicle?.galleryMedia ?? [],
  );
  const [galleryUploading, setGalleryUploading] = useState<{
    name: string;
    percent: number;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(savedVehicle);
  const isLastStep = step === STEPS.length;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateStep(current: number): string {
    if (current === 1) {
      if (!form.name.trim()) return "Vehicle name is required.";
      if (!form.year.trim()) return "Year is required.";
      if (!form.price.trim()) return "Price is required.";
    }
    if (current === 2) {
      if (!form.fuel.trim()) return "Fuel type is required.";
      if (!form.engine.trim()) return "Engine is required.";
      if (!form.horsepower.trim()) return "Horsepower is required.";
      if (!form.transmission.trim()) return "Transmission is required.";
    }
    return "";
  }

  function goNext() {
    const msg = validateStep(step);
    if (msg) {
      setError(msg);
      return;
    }
    setError("");
    setStep((s) => Math.min(s + 1, STEPS.length));
  }

  function goBack() {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleImageSelect(file: File) {
    setImagePreview(URL.createObjectURL(file));
    setImageUploadPercent(0);
    try {
      const { path } = await uploadFileInChunks(
        file,
        "vehicles/images",
        setImageUploadPercent,
      );
      setImagePath(path);
    } catch (err) {
      setError((err as ApiError).message || "Cover image upload failed.");
    } finally {
      setImageUploadPercent(null);
    }
  }

  async function handleGalleryFiles(files: FileList) {
    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith("video/");
      setGalleryUploading({ name: file.name, percent: 0 });

      try {
        const { path } = await uploadFileInChunks(
          file,
          isVideo ? "vehicles/videos" : "vehicles/images",
          (percent) => setGalleryUploading({ name: file.name, percent }),
        );

        if (savedVehicle) {
          const { media } = await addVehicleMedia(savedVehicle.id, {
            type: isVideo ? "video" : "image",
            path,
            alt: file.name,
            length: isVideo ? "short" : undefined,
          });
          setGallery((prev) => [...prev, media]);
        }
      } catch (err) {
        setError((err as ApiError).message || `Failed to upload ${file.name}.`);
      } finally {
        setGalleryUploading(null);
      }
    }
  }

  async function handleDeleteMedia(media: GalleryMediaItem) {
    if (!savedVehicle || !media.id) return;
    if (!confirm("Remove this media item?")) return;

    try {
      await deleteVehicleMedia(savedVehicle.id, media.id);
      setGallery((prev) => prev.filter((m) => m.id !== media.id));
    } catch (err) {
      setError((err as ApiError).message || "Failed to remove media.");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!isLastStep) {
      goNext();
      return;
    }

    setError("");
    setSaving(true);

    const payload: VehiclePayload = {
      name: form.name,
      year: form.year,
      type: form.type,
      mileage_km: Number(form.mileage_km) || 0,
      engine: form.engine,
      horsepower: form.horsepower,
      transmission: form.transmission,
      price: Number(form.price) || 0,
      location: form.location,
      fuel: form.fuel,
      badge: form.badge || undefined,
      description: form.description || undefined,
      stock: Number(form.stock) || 0,
      status: form.status,
      image_path: imagePath ?? undefined,
    };

    try {
      if (savedVehicle) {
        const { data } = await updateVehicle(savedVehicle.id, payload);
        setSavedVehicle(data);
      } else {
        const { data } = await createVehicle(payload);
        setSavedVehicle(data);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError((err as ApiError).message || "Failed to save vehicle.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-[#1a2332] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-bold text-white">
            {isEditing ? "Edit vehicle" : "Add vehicle"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (s.id < step) {
                    setError("");
                    setStep(s.id);
                  }
                }}
                disabled={s.id > step}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  s.id === step
                    ? "bg-[#d9ae1f] text-[#171c28]"
                    : s.id < step
                      ? "bg-[#d9ae1f]/20 text-[#d9ae1f] cursor-pointer"
                      : "bg-white/5 text-slate-500"
                }`}
              >
                {s.id < step ? <Check size={14} /> : s.id}
              </button>
              <span
                className={`hidden text-xs font-medium sm:block ${
                  s.id === step ? "text-white" : "text-slate-500"
                }`}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px flex-1 ${
                    s.id < step ? "bg-[#d9ae1f]/40" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Step 1: Basic info */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <Field label="Name" className="col-span-2">
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Toyota Fortuner GR-S"
                  />
                </Field>

                <Field label="Year">
                  <input
                    required
                    value={form.year}
                    onChange={(e) => update("year", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Type">
                  <select
                    value={form.type}
                    onChange={(e) => update("type", e.target.value)}
                    className={inputClass}
                  >
                    {VEHICLE_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-[#171c28]">
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Price (₱)">
                  <input
                    type="number"
                    min={0}
                    required
                    value={form.price}
                    onChange={(e) => update("price", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Stock">
                  <input
                    type="number"
                    min={0}
                    required
                    value={form.stock}
                    onChange={(e) => update("stock", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(e) =>
                      update(
                        "status",
                        e.target.value as VehiclePayload["status"],
                      )
                    }
                    className={inputClass}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option
                        key={s}
                        value={s}
                        className="bg-[#171c28] capitalize"
                      >
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Location">
                  <input
                    required
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Badge" className="col-span-2">
                  <input
                    value={form.badge}
                    onChange={(e) => update("badge", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Certified"
                  />
                </Field>
              </div>
            )}

            {/* Step 2: Specs */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-4">
                <Field label="Mileage (km)">
                  <input
                    type="number"
                    min={0}
                    required
                    value={form.mileage_km}
                    onChange={(e) => update("mileage_km", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Fuel">
                  <input
                    required
                    value={form.fuel}
                    onChange={(e) => update("fuel", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Engine">
                  <input
                    required
                    value={form.engine}
                    onChange={(e) => update("engine", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Horsepower">
                  <input
                    required
                    value={form.horsepower}
                    onChange={(e) => update("horsepower", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Transmission" className="col-span-2">
                  <input
                    required
                    value={form.transmission}
                    onChange={(e) => update("transmission", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Description" className="col-span-2">
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
            )}

            {/* Step 3: Media */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Cover image
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#171c28]">
                      {imagePreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imagePreview}
                          alt="Cover preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UploadCloud size={20} className="text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageSelect(file);
                        }}
                        className="block w-full text-xs text-slate-400 file:mr-3 file:rounded-full file:border-0 file:bg-[#d9ae1f]/15 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#d9ae1f]"
                      />
                      {imageUploadPercent !== null && (
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full bg-[#d9ae1f] transition-all"
                            style={{ width: `${imageUploadPercent}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Gallery photos &amp; videos
                  </label>

                  {!isEditing && (
                    <p className="mb-2 text-xs text-slate-500">
                      Save the vehicle first to unlock gallery uploads.
                    </p>
                  )}

                  {isEditing && (
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) handleGalleryFiles(e.target.files);
                        e.target.value = "";
                      }}
                      className="mb-3 block w-full text-xs text-slate-400 file:mr-3 file:rounded-full file:border-0 file:bg-[#d9ae1f]/15 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#d9ae1f]"
                    />
                  )}

                  {galleryUploading && (
                    <div className="mb-3 rounded-lg border border-white/10 bg-[#171c28] px-3 py-2 text-xs text-slate-400">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="truncate">
                          {galleryUploading.name}
                        </span>
                        <span>{galleryUploading.percent}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full bg-[#d9ae1f] transition-all"
                          style={{ width: `${galleryUploading.percent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-2">
                    {gallery.map((m) => (
                      <div
                        key={m.id ?? m.src}
                        className="group relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-[#171c28]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={resolveMediaUrl(
                            m.type === "image" ? m.src : (m.poster ?? m.src),
                            imageBaseUrl,
                          )}
                          alt={m.alt ?? ""}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteMedia(m)}
                          className="absolute right-1 top-1 hidden rounded-full bg-black/70 p-1 text-white group-hover:block"
                          aria-label="Remove"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer controls */}
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
            <button
              type="button"
              onClick={step === 1 ? onClose : goBack}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d9ae1f] to-[#f4c430] px-5 py-2.5 text-sm font-bold text-[#171c28] disabled:opacity-60"
            >
              {saving && <Loader2 size={15} className="animate-spin" />}
              {isLastStep
                ? isEditing
                  ? "Save changes"
                  : "Save vehicle"
                : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
