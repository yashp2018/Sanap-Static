import { useState } from "react";
import { motion } from "framer-motion";
import { User, Globe, Bell, Shield, Save, Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-purple-500" : "bg-white/10"}`}>
      <motion.div animate={{ x: checked ? 20 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
    </button>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/5">
        <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-purple-400" />
        </div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, type = "text", defaultValue = "", placeholder = "" }: { label: string; type?: string; defaultValue?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1.5 block">{label}</label>
      <input type={type} defaultValue={defaultValue} placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/50" />
    </div>
  );
}

export default function AdminSettings() {
  const [notifs, setNotifs] = useState({ newOrder: true, payment: true, lowStock: true, newCustomer: false });
  const [showPwd, setShowPwd] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 max-w-3xl">

      {/* Profile */}
      <Section title="Admin Profile" icon={User}>
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-5">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-2xl blur-md opacity-30" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white">A</div>
            </div>
            <div>
              <p className="text-sm font-bold text-white/80">Admin User</p>
              <p className="text-xs text-white/30">Administrator · Sanap Hi-Tech Nursery</p>
              <button className="text-xs text-purple-400 hover:text-purple-300 mt-1">Change photo</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name"    defaultValue="Admin User" />
            <Field label="Email"        type="email" defaultValue="admin@sanapnursery.com" />
            <Field label="Phone"        defaultValue="+91 74477 70803" />
            <Field label="Role"         defaultValue="Administrator" />
          </div>
          <button onClick={() => toast.success("Profile saved!")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 text-white text-xs font-semibold hover:bg-purple-600 transition-colors shadow-lg shadow-purple-500/20">
            <Save className="w-3.5 h-3.5" /> Save Profile
          </button>
        </div>
      </Section>

      {/* Website settings */}
      <Section title="Website Settings" icon={Globe}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Business Name"  defaultValue="Sanap Hi-Tech Nursery" />
            <Field label="Contact Phone"  defaultValue="+91 74477 70803" />
            <Field label="WhatsApp"       defaultValue="+91 74477 70803" />
            <Field label="Email"          defaultValue="info.sanapnursery@gmail.com" />
          </div>
          <Field label="Address" defaultValue="Near MUHS, Tal. Dindori, Dist. Nashik - 422 004" />
          <button onClick={() => toast.success("Website settings saved!")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 text-white text-xs font-semibold hover:bg-purple-600 transition-colors shadow-lg shadow-purple-500/20">
            <Save className="w-3.5 h-3.5" /> Save Settings
          </button>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notification Preferences" icon={Bell}>
        <div className="space-y-4">
          {[
            { key: "newOrder",     label: "New Order Alerts",       desc: "Get notified when a new order is placed" },
            { key: "payment",      label: "Payment Confirmations",  desc: "Alerts for successful payments" },
            { key: "lowStock",     label: "Low Stock Warnings",     desc: "Alert when variety stock falls below threshold" },
            { key: "newCustomer",  label: "New Customer Signup",    desc: "Notify when a new customer registers" },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
              <div>
                <p className="text-xs font-semibold text-white/70">{n.label}</p>
                <p className="text-[10px] text-white/30 mt-0.5">{n.desc}</p>
              </div>
              <Toggle checked={notifs[n.key as keyof typeof notifs]} onChange={v => setNotifs(p => ({ ...p, [n.key]: v }))} />
            </div>
          ))}
        </div>
      </Section>

      {/* Security */}
      <Section title="Security" icon={Shield}>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1.5 block">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input type={showPwd ? "text" : "password"} placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/50" />
              <button onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="New Password"     type="password" placeholder="••••••••" />
            <Field label="Confirm Password" type="password" placeholder="••••••••" />
          </div>
          <button onClick={() => toast.success("Password updated!")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-700 text-white text-xs font-semibold hover:bg-gray-600 transition-colors">
            <Lock className="w-3.5 h-3.5" /> Update Password
          </button>
        </div>
      </Section>
    </motion.div>
  );
}
