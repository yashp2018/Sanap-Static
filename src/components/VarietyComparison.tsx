import { useState } from "react";
import { X, Plus, BarChart3, Clock, Package, Truck, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Variety } from "@/data/products";

interface Props {
  varieties: Variety[];
}

const MONTHS = ["J","F","M","A","M","J","J","A","S","O","N","D"];

export default function VarietyComparison({ varieties }: Props) {
  const [selected, setSelected] = useState<Variety[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const add = (v: Variety) => {
    if (selected.length >= 3 || selected.find(s => s.id === v.id)) return;
    setSelected(prev => [...prev, v]);
    setOpen(false);
    setSearch("");
  };

  const remove = (id: string) => setSelected(prev => prev.filter(v => v.id !== id));

  const filtered = varieties.filter(v =>
    !selected.find(s => s.id === v.id) &&
    v.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 8);

  if (selected.length === 0) {
    return (
      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl gradient-cta flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-primary-foreground" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">Compare Varieties</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Select up to 3 varieties to compare side-by-side</p>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-primary/30 text-primary text-sm font-semibold hover:border-primary hover:bg-primary/5 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Variety to Compare
        </button>
        <SearchDropdown open={open} search={search} setSearch={setSearch} filtered={filtered} add={add} setOpen={setOpen} />
      </div>
    );
  }

  const rows: { label: string; key: keyof Variety | "season" }[] = [
    { label: "Crop",          key: "cropName" },
    { label: "Company",       key: "company" },
    { label: "Ready In",      key: "durationDays" },
    { label: "Min Order",     key: "minOrderQty" },
    { label: "Ex-Factory",    key: "priceExFactory" },
    { label: "15K+ Rate",     key: "price15k" },
    { label: "30K+ Rate",     key: "price30k" },
    { label: "Stock",         key: "stock" },
    { label: "Season",        key: "season" },
  ];

  return (
    <div className="bg-card border border-border/50 rounded-2xl shadow-card overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-cta flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-primary-foreground" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">Variety Comparison</h3>
        </div>
        <button onClick={() => setSelected([])} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase w-32">Feature</th>
              {selected.map(v => (
                <th key={v.id} className="px-4 py-3 min-w-[180px]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-left">
                      <p className="font-display font-bold text-foreground text-sm">{v.name}</p>
                      <p className="text-xs text-muted-foreground">{v.cropName}</p>
                    </div>
                    <button onClick={() => remove(v.id)} className="text-muted-foreground hover:text-destructive mt-0.5 shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </th>
              ))}
              {selected.length < 3 && (
                <th className="px-4 py-3 min-w-[160px]">
                  <div className="relative">
                    <button
                      onClick={() => setOpen(o => !o)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-dashed border-primary/30 text-primary text-xs font-semibold hover:border-primary hover:bg-primary/5 transition-all w-full justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                    <SearchDropdown open={open} search={search} setSearch={setSearch} filtered={filtered} add={add} setOpen={setOpen} />
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.label} className={`border-b border-border/50 ${ri % 2 === 0 ? "bg-muted/10" : ""}`}>
                <td className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">{row.label}</td>
                {selected.map(v => {
                  let val: React.ReactNode;
                  if (row.key === "season") {
                    val = (
                      <div className="flex gap-0.5">
                        {MONTHS.map((m, i) => (
                          <div
                            key={m}
                            title={m}
                            className={`w-4 h-4 rounded-sm text-[8px] flex items-center justify-center font-bold ${
                              v.availableMonths?.includes(i)
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {m}
                          </div>
                        ))}
                      </div>
                    );
                  } else if (row.key === "durationDays") {
                    val = <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-primary" />{v.durationDays} days</span>;
                  } else if (row.key === "minOrderQty" || row.key === "stock") {
                    val = <span className="flex items-center gap-1"><Package className="w-3 h-3 text-primary" />{(v[row.key] as number).toLocaleString()}</span>;
                  } else if (["priceExFactory","price15k","price30k"].includes(row.key as string)) {
                    const price = v[row.key] as number;
                    const best = Math.min(...selected.map(s => s[row.key] as number));
                    val = (
                      <span className={`font-bold ${price === best ? "text-primary" : "text-foreground"}`}>
                        ₹{price.toFixed(2)}
                        {price === best && selected.length > 1 && (
                          <span className="ml-1 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Best</span>
                        )}
                      </span>
                    );
                  } else {
                    val = <span>{String(v[row.key] ?? "—")}</span>;
                  }
                  return (
                    <td key={v.id} className="px-4 py-3 text-sm text-foreground">{val}</td>
                  );
                })}
                {selected.length < 3 && <td />}
              </tr>
            ))}
            {/* Features row */}
            <tr className="border-b border-border/50">
              <td className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Features</td>
              {selected.map(v => (
                <td key={v.id} className="px-4 py-3">
                  <ul className="space-y-1">
                    {v.features.slice(0, 3).map(f => (
                      <li key={f} className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Check className="w-3 h-3 text-primary shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
              {selected.length < 3 && <td />}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SearchDropdown({ open, search, setSearch, filtered, add, setOpen }: {
  open: boolean; search: string;
  setSearch: (s: string) => void;
  filtered: Variety[];
  add: (v: Variety) => void;
  setOpen: (o: boolean) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-elevated border border-border z-50"
        >
          <div className="p-2 border-b border-border">
            <input
              autoFocus
              type="text"
              placeholder="Search variety..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No varieties found</p>
            ) : filtered.map(v => (
              <button
                key={v.id}
                onClick={() => add(v)}
                className="w-full text-left px-3 py-2.5 hover:bg-muted transition-colors flex items-center justify-between gap-2"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{v.name}</p>
                  <p className="text-xs text-muted-foreground">{v.cropName} · {v.company}</p>
                </div>
                <span className="text-xs text-primary font-bold">₹{v.price15k}</span>
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-border">
            <button onClick={() => setOpen(false)} className="w-full text-xs text-muted-foreground hover:text-foreground py-1">Cancel</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
