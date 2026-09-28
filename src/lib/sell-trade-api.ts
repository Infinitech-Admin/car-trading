export type SellTradeStatus = "new" | "contacted" | "closed";

export type SellTradeRequest = {
  id: number;
  full_name: string;
  phone: string | null;
  email: string | null;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  type: string;
  condition: string;
  estimate: number;
  status: SellTradeStatus;
  notes: string | null;
  created_at: string;
};

export type SellTradePage = {
  data: SellTradeRequest[];
  current_page: number;
  last_page: number;
  total: number;
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      res.status === 401
        ? "Your session has expired. Please log in again."
        : body?.message || "Something went wrong.";
    throw Object.assign(new Error(message), { status: res.status });
  }

  return body as T;
}

export function fetchAdminSellTrades(params: {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
}): Promise<SellTradePage> {
  const qs = new URLSearchParams({
    page: String(params.page ?? 1),
    per_page: String(params.perPage ?? 15),
  });
  if (params.search) qs.set("search", params.search);
  if (params.status) qs.set("status", params.status);

  return request<SellTradePage>(`/api/sell-trade?${qs.toString()}`);
}

export async function updateSellTrade(
  id: number,
  payload: Partial<Pick<SellTradeRequest, "status" | "notes">>,
): Promise<SellTradeRequest> {
  const res = await request<{ data: SellTradeRequest }>(
    `/api/sell-trade/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return res.data;
}

export function deleteSellTrade(id: number): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/sell-trade/${id}`, {
    method: "DELETE",
  });
}
