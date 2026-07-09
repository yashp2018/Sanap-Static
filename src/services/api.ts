const BASE = "/api";

// ── Core fetch wrapper ────────────────────────────────────────
async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Request failed");
  return data;
}

// ── Types ─────────────────────────────────────────────────────
export interface ApiVariety {
  id: number;
  slug: string;
  name: string;
  company: string;
  crop_slug: string;
  crop_name: string;
  category_slug: string;
  category_name: string;
  image_url: string | null;
  duration_days: number;
  stock: number;
  min_order_qty: number;
  price_ex_factory: number;
  price_15k: number;
  price_30k: number;
  delivery_local_charge: number;
  delivery_250km_charge: number;
  features: string[];
  advantages: string[];
  agronomic_tips: string[];
  available_months: number[];
  char_segment?: string;
  char_size?: string;
  char_colour?: string;
  char_shape?: string;
  char_plant_type?: string;
  char_avg_weight?: string;
  char_maturity_days?: string;
  char_sowing_season?: string;
  char_harvesting_season?: string;
  char_vigour?: string;
}

export interface ApiCategory {
  id: number;
  slug: string;
  name: string;
  icon: string;
}

export interface ApiCrop {
  id: number;
  slug: string;
  name: string;
  image_url: string | null;
  category_slug: string;
  category_name: string;
  varieties: number;
}

export interface ApiCartItem {
  id: number;
  variety_id: number;
  variety_slug: string;
  variety_name: string;
  company: string;
  image_url: string | null;
  crop_name: string;
  quantity: number;
  delivery_type: "local" | "250km";
  price_ex_factory: number;
  price_15k: number;
  price_30k: number;
  delivery_local_charge: number;
  delivery_250km_charge: number;
  stock: number;
  min_order_qty: number;
}

export interface ApiOrder {
  id: number;
  order_number: string;
  order_status: string;
  payment_method: string;
  payment_status: string;
  payment_type: "advance" | "full";
  advance_percentage: number;
  advance_amount: number;
  remaining_amount: number;
  total_amount: number;
  total_plants: number;
  delivery_city: string;
  delivery_state: string;
  created_at: string;
  items: ApiOrderItem[];
}

export interface ApiOrderItem {
  variety_name: string;
  crop_name: string;
  company: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  delivery_type: string;
}

// ── Catalog ───────────────────────────────────────────────────
export const fetchCategories = () =>
  api<{ success: true; data: ApiCategory[] }>("/categories");

export const fetchCrops = (category?: string) =>
  api<{ success: true; data: ApiCrop[] }>(
    `/crops${category ? `?category=${category}` : ""}`
  );

export const fetchVarieties = (params?: {
  crop?: string;
  category?: string;
  search?: string;
}) => {
  const q = new URLSearchParams();
  if (params?.crop)     q.set("crop",     params.crop);
  if (params?.category) q.set("category", params.category);
  if (params?.search)   q.set("search",   params.search);
  const qs = q.toString();
  return api<{ success: true; data: ApiVariety[] }>(
    `/varieties${qs ? `?${qs}` : ""}`
  );
};

export const fetchVariety = (slug: string) =>
  api<{ success: true; data: ApiVariety }>(`/variety/${slug}`);

// ── Cart ──────────────────────────────────────────────────────
export const getCart = () =>
  api<{ success: true; data: ApiCartItem[] }>("/cart");

export const addToCart = (variety_id: number, quantity: number, delivery_type: "local" | "250km") =>
  api<{ success: true; data: ApiCartItem[] }>("/cart/add", {
    method: "POST",
    body: JSON.stringify({ variety_id, quantity, delivery_type }),
  });

export const updateCart = (variety_id: number, updates: { quantity?: number; delivery_type?: "local" | "250km" }) =>
  api<{ success: true; data: ApiCartItem[] }>("/cart/update", {
    method: "PATCH",
    body: JSON.stringify({ variety_id, ...updates }),
  });

export const removeFromCart = (variety_id: number) =>
  api<{ success: true; data: ApiCartItem[] }>(`/cart/${variety_id}`, {
    method: "DELETE",
  });

export const clearCart = () =>
  api<{ success: true; data: [] }>("/cart", { method: "DELETE" });

// ── Orders ────────────────────────────────────────────────────
export const placeOrder = (data: {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  delivery_pincode: string;
  delivery_landmark?: string;
  payment_method: "razorpay" | "cod" | "bank";
  payment_type: "advance" | "full";
  notes?: string;
}) =>
  api<{ success: true; data: {
    order_number: string;
    total_amount: number;
    advance_amount: number;
    remaining_amount: number;
    advance_percentage: number;
    payment_type: string;
    total_plants: number;
    order_status: string;
    payment_status: string;
  } }>(
    "/orders/place",
    { method: "POST", body: JSON.stringify(data) }
  );

export const getOrders = () =>
  api<{ success: true; data: ApiOrder[] }>("/orders");

export const getOrder = (orderNumber: string) =>
  api<{ success: true; data: ApiOrder }>(`/orders/${orderNumber}`);

export const cancelOrder = (orderNumber: string, reason: string) =>
  api<{ success: true; message: string }>(`/orders/${orderNumber}/cancel`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });

// ── Price helpers ────────────────────────────────────────────
export function resolvePrice(v: ApiVariety | ApiCartItem, quantity: number): number {
  const p30 = Number((v as ApiVariety).price_30k ?? (v as ApiCartItem).price_30k);
  const p15 = Number((v as ApiVariety).price_15k ?? (v as ApiCartItem).price_15k);
  const pEx = Number((v as ApiVariety).price_ex_factory ?? (v as ApiCartItem).price_ex_factory);
  if (quantity >= 30000) return p30;
  if (quantity >= 15000) return p15;
  return pEx;
}

export function resolveDelivery(v: ApiVariety | ApiCartItem, quantity: number, type: "local" | "250km"): number {
  const local  = Number((v as ApiVariety).delivery_local_charge ?? (v as ApiCartItem).delivery_local_charge);
  const far    = Number((v as ApiVariety).delivery_250km_charge ?? (v as ApiCartItem).delivery_250km_charge);
  return (type === "local" ? local : far) * quantity;
}

export function resolveTotal(v: ApiVariety | ApiCartItem, quantity: number, type: "local" | "250km"): number {
  return resolvePrice(v, quantity) * quantity + resolveDelivery(v, quantity, type);
}
