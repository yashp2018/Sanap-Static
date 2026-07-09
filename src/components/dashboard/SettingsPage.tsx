import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell, Moon, Globe, Shield, Trash2, LogOut,
  ChevronRight, Sun, Smartphone, Mail, MessageCircle,
} from "lucide-react";
import { toast } from "sonner";

interface SettingsPageProps { onLogout: () => void; }

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-indigo-600" : "bg-gray-200"}`}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  );
}

function SettingRow({ icon: Icon, label, desc, children }: {
  icon: React.ElementType; label: string; desc?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-gray-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          {desc && <p className="text-xs text-gray-400">{desc}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage({ onLogout }: SettingsPageProps) {
  const [prefs, setPrefs] = useState({
    emailNotif:   true,
    smsNotif:     true,
    whatsappNotif: true,
    pushNotif:    false,
    darkMode:     false,
    language:     "en",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const set = (key: keyof typeof prefs, val: boolean | string) =>
    setPrefs(p => ({ ...p, [key]: val }));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">

      {/* Notifications */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-500" /> Notification Preferences
        </h3>
        <p className="text-xs text-gray-400 mb-5">Choose how you want to receive order updates</p>
        <SettingRow icon={Mail} label="Email Notifications" desc="Order updates via email">
          <Toggle checked={prefs.emailNotif} onChange={v => set("emailNotif", v)} />
        </SettingRow>
        <SettingRow icon={Smartphone} label="SMS Notifications" desc="Order updates via SMS">
          <Toggle checked={prefs.smsNotif} onChange={v => set("smsNotif", v)} />
        </SettingRow>
        <SettingRow icon={MessageCircle} label="WhatsApp Notifications" desc="Updates on WhatsApp">
          <Toggle checked={prefs.whatsappNotif} onChange={v => set("whatsappNotif", v)} />
        </SettingRow>
        <SettingRow icon={Bell} label="Push Notifications" desc="Browser push alerts">
          <Toggle checked={prefs.pushNotif} onChange={v => set("pushNotif", v)} />
        </SettingRow>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
          <Sun className="w-4 h-4 text-indigo-500" /> Appearance & Language
        </h3>
        <p className="text-xs text-gray-400 mb-5">Customize your dashboard experience</p>
        <SettingRow icon={prefs.darkMode ? Moon : Sun} label="Dark Mode" desc="Switch to dark theme">
          <Toggle checked={prefs.darkMode} onChange={v => { set("darkMode", v); toast.info("Dark mode coming soon!"); }} />
        </SettingRow>
        <SettingRow icon={Globe} label="Language" desc="Dashboard display language">
          <select
            value={prefs.language}
            onChange={e => set("language", e.target.value)}
            className="text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
          </select>
        </SettingRow>
      </div>

      {/* Security */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-500" /> Security
        </h3>
        <p className="text-xs text-gray-400 mb-5">Manage your account security</p>
        <button
          onClick={() => toast.info("Active sessions management coming soon!")}
          className="w-full flex items-center justify-between py-4 border-b border-gray-50 hover:bg-gray-50 rounded-xl px-2 -mx-2 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">Active Sessions</p>
              <p className="text-xs text-gray-400">View and manage logged-in devices</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between py-4 hover:bg-red-50 rounded-xl px-2 -mx-2 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <LogOut className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-red-500">Sign Out</p>
              <p className="text-xs text-gray-400">Log out of your account</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400" />
        </button>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-red-100">
        <h3 className="font-bold text-red-500 mb-1 flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Danger Zone
        </h3>
        <p className="text-xs text-gray-400 mb-5">Irreversible actions — proceed with caution</p>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 rounded-2xl p-4 space-y-3"
          >
            <p className="text-sm font-semibold text-red-700">Are you absolutely sure?</p>
            <p className="text-xs text-red-500">This will permanently delete your account and all order history. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-white transition-colors">
                Cancel
              </button>
              <button
                onClick={() => { toast.error("Account deletion requires contacting support."); setShowDeleteConfirm(false); }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* App info */}
      <div className="text-center py-4 space-y-1">
        <p className="text-xs text-gray-400">Sanap Hi-Tech Nursery Dashboard</p>
        <p className="text-xs text-gray-300">v1.0.0 · Built with ❤️ for farmers</p>
      </div>
    </motion.div>
  );
}
