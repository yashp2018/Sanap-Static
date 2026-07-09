// ── Admin Types ───────────────────────────────────────────────

export interface AdminOrder {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items_summary?: string;
  items?: { variety_name: string; crop_name: string; quantity: number; unit_price: number; line_total: number; delivery_type: string }[];
  total_plants: number;
  total_amount: number;
  advance_amount: number;
  remaining_amount: number;
  advance_percentage: number;
  payment_type: "advance" | "full";
  order_status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_method: string;
  payment_status: "pending" | "advance_paid" | "fully_paid" | "partially_paid" | "cancelled" | "refunded";
  delivery_city: string;
  delivery_state: string;
  delivery_pincode?: string;
  created_at: string;
}

export interface AdminCustomer {
  id: number;
  name: string;
  phone: string;
  email: string;
  total_orders: number;
  total_spent: number;
  total_plants?: number;
  last_order_at?: string;
  status?: "active" | "blocked";
  joined?: string;
  created_at?: string;
}

export interface AdminVariety {
  id: number;
  slug?: string;
  name: string;
  company: string;
  crop_name: string;
  crop_slug?: string;
  category: string;
  category_name?: string;
  stock: number;
  min_order_qty: number;
  price_ex_factory: number;
  price_15k: number;
  price_30k: number;
  delivery_local: number;
  delivery_250km: number;
  delivery_local_charge?: number;
  delivery_250km_charge?: number;
  is_active?: boolean;
  status?: "active" | "inactive" | "low_stock" | "out_of_stock";
  image_url?: string;
}

export interface AdminDashboardStats {
  total_orders: number;
  pending_orders: number;
  confirmed_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  total_revenue: number;
  total_plants_sold: number;
  total_customers: number;
  active_varieties: number;
  low_stock_count: number;
}

export interface AdminDashboard {
  stats: AdminDashboardStats;
  monthly: { month: string; month_num: number; revenue: number; orders: number }[];
  cropSales: { crop_name: string; total_plants: number; total_revenue: number }[];
  lowStock: { id: number; slug: string; name: string; stock: number; crop_name: string; company: string }[];
}

// ── Admin API helpers ─────────────────────────────────────────

const BASE = "/api/admin";

async function adminApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Request failed");
  return data;
}

export const fetchDashboard = () =>
  adminApi<{ success: true; data: AdminDashboard }>("/dashboard");

export const fetchAdminOrders = (status?: string, page = 1, limit = 20) => {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) q.set("status", status);
  return adminApi<{ success: true; data: AdminOrder[]; total: number; page: number; limit: number }>(`/orders?${q}`);
};

export const updatePaymentStatus = (id: number, payment_status: string) =>
  adminApi<{ success: true; data: AdminOrder }>(`/orders/${id}/payment`, {
    method: "PATCH",
    body: JSON.stringify({ payment_status }),
  });

export const updateOrderStatus = (id: number, status: string) =>
  adminApi<{ success: true; data: AdminOrder }>(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const fetchAdminVarieties = () =>
  adminApi<{ success: true; data: AdminVariety[] }>("/varieties");

export const updateVariety = (id: number, data: Partial<AdminVariety>) =>
  adminApi<{ success: true; data: AdminVariety }>(`/varieties/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: data.name,
      company: data.company,
      stock: data.stock,
      is_active: data.is_active,
      price_ex_factory: data.price_ex_factory,
      price_15k: data.price_15k,
      price_30k: data.price_30k,
      delivery_local_charge: data.delivery_local ?? data.delivery_local_charge,
      delivery_250km_charge: data.delivery_250km ?? data.delivery_250km_charge,
      min_order_qty: data.min_order_qty,
    }),
  });

export const deactivateVariety = (id: number) =>
  adminApi<{ success: true }>(`/varieties/${id}`, { method: "DELETE" });

export const fetchAdminCustomers = () =>
  adminApi<{ success: true; data: AdminCustomer[] }>("/customers");

export const fetchAdminCategories = () =>
  adminApi<{ success: true; data: { id: number; slug: string; name: string; icon: string; crop_count: number; variety_count: number }[] }>("/categories");

// ── Derive variety status from API data ───────────────────────
export function deriveStatus(v: AdminVariety): "active" | "inactive" | "low_stock" | "out_of_stock" {
  if (!v.is_active) return "inactive";
  if (v.stock === 0) return "out_of_stock";
  if (v.stock < 5000) return "low_stock";
  return "active";
}
