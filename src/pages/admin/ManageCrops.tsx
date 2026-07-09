import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Leaf } from "lucide-react";
import { toast } from "sonner";
import { fetchAdminCategories } from "@/components/admin/adminData";
import { fetchCrops, type ApiCrop } from "@/services/api";

export default function ManageCrops() {
  const [crops, setCrops]         = useState<ApiCrop[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);

  useEffect(() => {
    Promise.all([
      fetchCrops().then(r => setCrops(r.data)),
      fetchAdminCategories().then(r => setCategories(r.data.map(c => ({ slug: c.slug, name: c.name })))),
    ])
      .catch(() => toast.error("Failed to load crops"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = crops.filter(c =>
    (catFilter === "All" || c.category_slug === catFilter) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crops..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/8 rounded-xl text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/50" />
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => setCatFilter("All")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${catFilter === "All" ? "bg-purple-500/20 border-purple-500/40 text-purple-300" : "bg-white/[0.03] border-white/8 text-white/40 hover:text-white/70"}`}>
            All
          </button>
          {categories.map(c => (
            <button key={c.slug} onClick={() => setCatFilter(c.slug)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${catFilter === c.slug ? "bg-purple-500/20 border-purple-500/40 text-purple-300" : "bg-white/[0.03] border-white/8 text-white/40 hover:text-white/70"}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-white/30 text-sm">Loading crops...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((crop, i) => (
            <motion.div
              key={crop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden group"
            >
              <div className="relative h-36 bg-gradient-to-br from-purple-500/10 to-blue-500/10 overflow-hidden">
                {crop.image_url ? (
                  <img src={crop.image_url} alt={crop.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Leaf className="w-12 h-12 text-purple-500/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020]/80 to-transparent" />
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                  active
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white/80 text-sm">{crop.name}</h3>
                <p className="text-[10px] text-white/30 mt-0.5">{crop.category_name}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-purple-400 font-semibold">{crop.varieties} varieties</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
