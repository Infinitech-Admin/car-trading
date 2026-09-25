// lib/api.ts

// Root host — used as-is for Sanctum's CSRF cookie route, which Laravel
// registers unprefixed (it's set up by the Sanctum service provider, not
// routes/api.php).
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Everything in routes/api.php is auto-prefixed with "api" by Laravel
// (see `php artisan route:list` — e.g. POST api/register), so every
// actual endpoint call below goes through this base instead of API_URL.
const API_BASE = `${API_URL}/api`;

export interface ApiError extends Error {
  status?: number;
  errors?: Record<string, string[]> | null;
}

/**
 * Reads a cookie by name. The only cookie we ever read here is
 * XSRF-TOKEN, which Laravel deliberately leaves non-httpOnly so the SPA
 * can echo it back as an anti-CSRF header. The actual auth session cookie
 * is httpOnly and is never touched by this code — the browser attaches it
 * automatically on every request because we pass credentials: "include".
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Vehicle images/videos come back from the API as paths relative to the
 * API's own origin (e.g. "/storage/vehicles/images/xyz.jpg", from Laravel's
 * Storage::url()). Since the frontend and API run on different
 * hosts/ports, those relative paths resolve against the wrong origin if
 * rendered as-is.
 *
 * This takes `base` as an argument rather than reading an env var itself,
 * on purpose: it lets a Server Component read a plain (non-NEXT_PUBLIC_)
 * env var like LARAVEL_API_URL on the server and pass the resolved string
 * down as a prop, instead of requiring the value to be exposed to the
 * client bundle.
 */
export function resolveMediaUrl(
  path: string | null | undefined,
  base: string,
): string {
  if (!path) return "";
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:")) return path;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function ensureCsrfCookie(): Promise<void> {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

/**
 * Central fetch wrapper. Never reads or writes localStorage/sessionStorage
 * — auth state lives entirely in the httpOnly session cookie set by the
 * API, and CSRF protection lives in the (non-httpOnly, by design) XSRF
 * cookie mirrored back as a header below.
 */
export async function apiRequest<T = unknown>(
  path: string,
  { method = "GET", body, headers, signal }: ApiRequestOptions = {},
): Promise<T> {
  const isUnsafeMethod = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  if (isUnsafeMethod) {
    await ensureCsrfCookie();
  }

  const xsrfToken = getCookie("XSRF-TOKEN");

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    signal,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || "Something went wrong. Please try again.",
    ) as ApiError;
    error.status = response.status;
    error.errors = data?.errors || null;
    throw error;
  }

  return data as T;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterPayload {
  name: string;
  phone?: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse {
  verification_email: string;
  [key: string]: unknown;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface ResendVerificationResponse {
  message?: string;
  [key: string]: unknown;
}

export const login = (payload: LoginPayload) =>
  apiRequest("/login", { method: "POST", body: payload });

export const register = (payload: RegisterPayload) =>
  apiRequest<RegisterResponse>("/register", { method: "POST", body: payload });

export const verifyEmail = (payload: VerifyEmailPayload) =>
  apiRequest("/verify-email", { method: "POST", body: payload });

export const resendVerification = (payload: ResendVerificationPayload) =>
  apiRequest<ResendVerificationResponse>("/resend-verification", {
    method: "POST",
    body: payload,
  });

export const logout = () => apiRequest("/logout", { method: "POST" });

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

export interface MeResponse {
  user: AuthUser;
}

export const fetchMe = (options?: { signal?: AbortSignal }) =>
  apiRequest<MeResponse>("/me", { method: "GET", signal: options?.signal });
// ---- Vehicles (admin CRUD) ----

export interface GalleryMediaItem {
  id?: number;
  type: "image" | "video";
  src: string;
  alt?: string | null;
  poster?: string | null;
  length?: "short" | "long" | null;
  duration?: string | null;
}

export interface Vehicle {
  id: number;
  name: string;
  year: string;
  type: string;
  mileage: string;
  mileage_km: number;
  engine: string;
  horsepower: string;
  transmission: string;
  price: string;
  price_value: number;
  location: string;
  fuel: string;
  badge: string | null;
  description: string | null;
  stock: number;
  status: "available" | "reserved" | "sold";
  image: string | null;
  galleryMedia: GalleryMediaItem[];
  created_at: string;
  updated_at: string;
}

export interface VehiclePayload {
  name: string;
  year: string;
  type: string;
  mileage_km: number;
  engine: string;
  horsepower: string;
  transmission: string;
  price: number;
  location: string;
  fuel: string;
  badge?: string;
  description?: string;
  stock: number;
  status: "available" | "reserved" | "sold";
  image_path?: string | null;
}

export const fetchAdminVehicles = (params?: {
  search?: string;
  status?: string;
}) => {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.status) query.set("status", params.status);
  const qs = query.toString();
  return apiRequest<{ data: Vehicle[] }>(
    `/admin/vehicles${qs ? `?${qs}` : ""}`,
  );
};

export const createVehicle = (payload: VehiclePayload) =>
  apiRequest<{ data: Vehicle }>("/admin/vehicles", {
    method: "POST",
    body: payload,
  });

export const updateVehicle = (id: number, payload: VehiclePayload) =>
  apiRequest<{ data: Vehicle }>(`/admin/vehicles/${id}`, {
    method: "PUT",
    body: payload,
  });

export const deleteVehicle = (id: number) =>
  apiRequest(`/admin/vehicles/${id}`, { method: "DELETE" });

export const addVehicleMedia = (
  vehicleId: number,
  payload: {
    type: "image" | "video";
    path: string;
    poster_path?: string;
    alt?: string;
    length?: "short" | "long";
    duration?: string;
  },
) =>
  apiRequest<{ media: GalleryMediaItem }>(
    `/admin/vehicles/${vehicleId}/media`,
    { method: "POST", body: payload },
  );

export const deleteVehicleMedia = (vehicleId: number, mediaId: number) =>
  apiRequest(`/admin/vehicles/${vehicleId}/media/${mediaId}`, {
    method: "DELETE",
  });

// ---- Chunked uploads (safe for 500MB+ video files) ----

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk

async function apiUpload<T = unknown>(
  path: string,
  formData: FormData,
): Promise<T> {
  await ensureCsrfCookie();
  const xsrfToken = getCookie("XSRF-TOKEN");

  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
      // No Content-Type here — the browser sets the multipart boundary.
    },
    body: formData,
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Upload failed.") as ApiError;
    error.status = response.status;
    error.errors = data?.errors || null;
    throw error;
  }

  return data as T;
}

export type UploadFolder =
  | "vehicles/images"
  | "vehicles/videos"
  | "vehicles/posters";

/**
 * Uploads a file in fixed-size chunks so large videos never hit PHP's
 * per-request upload_max_filesize/post_max_size limits, and so a flaky
 * connection only has to retry one small chunk instead of the whole
 * file. Reports 0–100 progress via onProgress.
 *
 * Field names below are dictated by UploadController@chunk /
 * UploadController@complete on the Laravel side — keep them in sync:
 *   chunk:    identifier, index, total, chunk
 *   complete: identifier, filename, folder, total
 */
export async function uploadFileInChunks(
  file: File,
  folder: UploadFolder,
  onProgress?: (percent: number) => void,
): Promise<{ path: string; url: string }> {
  const identifier = crypto.randomUUID();
  const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(file.size, start + CHUNK_SIZE);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("identifier", identifier);
    formData.append("index", String(i));
    formData.append("total", String(totalChunks));
    formData.append("chunk", chunk, file.name);

    await apiUpload("/admin/uploads/chunk", formData);
    onProgress?.(Math.round(((i + 1) / totalChunks) * 100));
  }

  const completeForm = new FormData();
  completeForm.append("identifier", identifier);
  completeForm.append("total", String(totalChunks));
  completeForm.append("filename", file.name);
  completeForm.append("folder", folder);

  return apiUpload<{ path: string; url: string }>(
    "/admin/uploads/complete",
    completeForm,
  );
}
