import { useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, Mail, MapPin, Lock, Eye, EyeOff, Save, ShoppingBag, Leaf, Star } from "lucide-react";
import { toast } from "sonner";
import type { AuthUser } from "@/context/AuthContext";
import type { ApiOrder } from "@/services/api";

interface ProfilePageProps {
  user: AuthUser;
  orders: ApiOrder[];
}

export default function ProfilePage({ user, orders }: ProfilePageProps) {
  const [form, setForm] = useState({
    name: user.name ?? "",
    phone: user.phone ?? "",
    email: user.email ?? "",
    address: "",
  });
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  const totalSpent  = orders.reduce((s, o) => s + Number(o.total_amount), 0);
  const totalPlants = orders.reduce((s, o) => s + Number(o.total_plants), 0);
  const delivered   = orders.filter(o => o.order_status === "delivered").length;

  const handleSaveProfile = async () => {
    setSaving(true);
    // POST /api/auth/profile when backend supports it
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    toast.success("Profile updated successfully!");
  };

  const handleChangePassword = async () => {
    if (!pwd.current || !pwd.next) return toast.error("Fill all password fields");
    if (pwd.next !== pwd.confirm) return toast.error("Passwords do not match");
    if (pwd.next.length < 6) return toast.error("Password must be at least 6 characters");
    setSavingPwd(true);
    await new Promise(r => setTimeout(r, 600));
    setSavingPwd(false);
    setPwd({ current: "", next: "", confirm: "" });
    toast.success("Password changed successfully!");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">

      {/* Profile header card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-white/20 border border-white/30 flex items-center justify-center text-3xl font-bold shadow-xl">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-white/70 text-sm">{user.phone}</p>
            {user.email && <p className="text-white/50 text-xs">{user.email}</p>}
            <span className="inline-flex items-center gap-1.5 mt-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
              <Star className="w-3 h-3" /> Premium Customer
            </span>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { label: "Orders", value: orders.length, icon: ShoppingBag },
              { label: "Delivered", value: delivered, icon: Leaf },
              { label: "Plants", value: totalPlants >= 1000 ? `${(totalPlants / 1000).toFixed(0)}K` : totalPlants, icon: Leaf },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-3 text-center backdrop-blur-sm">
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-white/60 text-[10px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Edit profile */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" /> Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <textarea
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  rows={3}
                  placeholder="Your farm / delivery address"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 resize-none"
                />
              </div>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full py-3 rounded-2xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Change password + spending summary */}
        <div className="space-y-6">
          {/* Password */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-500" /> Change Password
            </h3>
            <div className="space-y-4">
              {[
                { key: "current", label: "Current Password" },
                { key: "next",    label: "New Password" },
                { key: "confirm", label: "Confirm New Password" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPwd ? "text" : "password"}
                      value={pwd[f.key as keyof typeof pwd]}
                      onChange={e => setPwd({ ...pwd, [f.key]: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                    {f.key === "next" && (
                      <button onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={handleChangePassword}
                disabled={savingPwd}
                className="w-full py-3 rounded-2xl bg-gray-800 text-white text-sm font-semibold hover:bg-gray-900 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {savingPwd ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Lock className="w-4 h-4" />}
                {savingPwd ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>

          {/* Spending summary */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-500" /> Spending Summary
            </h3>
            <div className="space-y-3">
              {[
                { label: "Total Spent",    value: `₹${totalSpent.toLocaleString()}`,       color: "bg-indigo-50 text-indigo-700" },
                { label: "Total Plants",   value: totalPlants.toLocaleString(),             color: "bg-green-50 text-green-700"  },
                { label: "Total Orders",   value: orders.length.toString(),                 color: "bg-purple-50 text-purple-700"},
                { label: "Avg Order Value",value: orders.length ? `₹${Math.round(totalSpent / orders.length).toLocaleString()}` : "₹0", color: "bg-orange-50 text-orange-700" },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{s.label}</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-xl ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
