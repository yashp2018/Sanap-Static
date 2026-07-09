import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, X, ChevronRight as Arrow } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCategories, fetchCrops, fetchVarieties, ApiCategory, ApiCrop } from "@/services/api";
import tomatoAryaman from "@/assets/vegetables/Aryaman.png";
import chilliImg from "@/assets/vegetables/Chilli.png";
import brinjalImg from "@/assets/vegetables/Brinjal.png";
import capsicumImg from "@/assets/vegetables/Capsicum.png";
import cucumberImg from "@/assets/vegetables/cucumber.png";
import cabbageImg from "@/assets/vegetables/Cabbage.png";
import cauliflowerImg from "@/assets/vegetables/Cauliflower.png";
import bitterGourdImg from "@/assets/vegetables/bitter Gourd.png";
import watermelonImg from "@/assets/vegetables/Watermelon.png";
import sugarQueenImg from "@/assets/vegetables/Suger Queen.png";
import maxImg from "@/assets/vegetables/Max.png";
import papayaImg from "@/assets/vegetables/Papaya.png";
import edenOrangeImg from "@/assets/vegetables/Eden Orange.png";
import freshOrangeImg from "@/assets/vegetables/Fresh Orange.png";
import ProductCard from "@/components/ProductCard";

const ITEMS_PER_PAGE = 9;

function fallbackImage(v: any): string {
  if (v.image_url) return v.image_url;
  const s = v.crop_slug;
  if (s === "tomato") return tomatoAryaman;
  if (s === "chili") return chilliImg;
  if (s === "brinjal") return brinjalImg;
  if (s === "capsicum") return capsicumImg;
  if (s === "cucumber") return cucumberImg;
  if (s === "cabbage") return cabbageImg;
  if (s === "cauliflower") return cauliflowerImg;
  if (s === "bittergourd") return bitterGourdImg;
  if (s === "watermelon") return v.slug === "wm-sugarqueen" ? sugarQueenImg : v.slug === "wm-max" ? maxImg : watermelonImg;
  if (s === "papaya") return papayaImg;
  if (s === "marigold") return v.slug === "mar-freshorange" ? freshOrangeImg : edenOrangeImg;
  return "/SA.png";
}

function cropFallback(slug: string): string {
  if (slug === "tomato") return tomatoAryaman;
  if (slug === "chili") return chilliImg;
  if (slug === "brinjal") return brinjalImg;
  if (slug === "capsicum") return capsicumImg;
  if (slug === "cucumber") return cucumberImg;
  if (slug === "cabbage") return cabbageImg;
  if (slug === "cauliflower") return cauliflowerImg;
  if (slug === "bittergourd") return bitterGourdImg;
  if (slug === "watermelon") return watermelonImg;
  if (slug === "papaya") return papayaImg;
  if (slug === "marigold") return edenOrangeImg;
  return "/SA.png";
}

// ── Step indicator ────────────────────────────────────────────
function Breadcrumb({ category, crop, catName, cropName, onReset, onBackToCrops }: {
  category: string; crop: string; catName: string; cropName: string;
  onReset: () => void; onBackToCrops: () => void;
}) {
  if (!category) return null;
  return (
    <div className="flex items-center gap-2 text-sm mb-8 flex-wrap">
      <button onClick={onReset} className="text-muted-foreground hover:text-primary transition-colors font-medium">
        All Products
      </button>
      <Arrow className="w-3.5 h-3.5 text-muted-foreground/50" />
      <button
        onClick={onBackToCrops}
        className={`font-medium transition-colors ${!crop ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
      >
        {catName}
      </button>
      {crop && (
        <>
          <Arrow className="w-3.5 h-3.5 text-muted-foreground/50" />
          <span className="text-primary font-semibold">{cropName}</span>
        </>
      )}
    </div>
  );
}

export default function Products() {
  const [searchParams] = useSearchParams();
  const [search, setSearch]               = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedCrop, setSelectedCrop]         = useState(searchParams.get("crop") || "");
  const [currentPage, setCurrentPage]           = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [crops, setCrops]           = useState<ApiCrop[]>([]);
  const [varieties, setVarieties]   = useState<any[]>([]);
  const [loadingV, setLoadingV]     = useState(false);

  // Load categories + crops
  useEffect(() => {
    fetchCategories().then(r => setCategories(r.data)).catch(() => {});
    fetchCrops().then(r => setCrops(r.data)).catch(() => {});
  }, []);

  // Load varieties only when a crop is selected OR browsing all (no category)
  useEffect(() => {
    if (selectedCategory && !selectedCrop) {
      setVarieties([]);
      return;
    }
    setLoadingV(true);
    fetchVarieties({
      category: selectedCategory || undefined,
      crop:     selectedCrop     || undefined,
      search:   search           || undefined,
    })
      .then(r => {
        setVarieties(r.data.map(v => ({
          ...v,
          image:               fallbackImage(v),
          minOrderQty:         Number(v.min_order_qty)         || 1000,
          price15k:            Number(v.price_15k)             || 0,
          price30k:            Number(v.price_30k)             || 0,
          priceExFactory:      Number(v.price_ex_factory)      || 0,
          deliveryLocalCharge: Number(v.delivery_local_charge) || 0,
          delivery250kmCharge: Number(v.delivery_250km_charge) || 0,
          durationDays:        Number(v.duration_days)         || 28,
          stock:               Number(v.stock)                 || 0,
          cropName:            v.crop_name  || "",
          availableMonths:     v.available_months || [],
        })));
        setCurrentPage(1);
      })
      .catch(() => setVarieties([]))
      .finally(() => setLoadingV(false));
  }, [selectedCategory, selectedCrop, search]);

  const visibleCrops = selectedCategory
    ? crops.filter(c => c.category_slug === selectedCategory)
    : crops;

  const paginated      = varieties.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages     = Math.ceil(varieties.length / ITEMS_PER_PAGE);

  const catName  = categories.find(c => c.slug === selectedCategory)?.name || "";
  const cropName = crops.find(c => c.slug === selectedCrop)?.name || "";

  const resetAll      = () => { setSelectedCategory(""); setSelectedCrop(""); setSearch(""); setCurrentPage(1); };
  const backToCrops   = () => { setSelectedCrop(""); setCurrentPage(1); };
  const selectCat     = (slug: string) => { setSelectedCategory(slug); setSelectedCrop(""); setSearch(""); setCurrentPage(1); };
  const selectCrop    = (slug: string) => { setSelectedCrop(slug); setCurrentPage(1); };

  // Decide what to render in main area
  const showCropsGrid    = selectedCategory && !selectedCrop;
  const showVarieties    = !selectedCategory || selectedCrop;

  return (
    <div className="min-h-screen bg-background">

      {/* ── Page Header ── */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-14 border-b border-border/40">
        <div className="container-nursery text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-bold text-primary uppercase tracking-[0.25em] mb-3 block">Browse Our Collection</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">Product Catalogue</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Premium grafted seedlings — select a category to explore
            </p>
          </motion.div>

          {/* ── Category Tabs ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="flex flex-wrap justify-center gap-3 mt-10"
          >
            <button
              onClick={resetAll}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all border-2 ${
                !selectedCategory
                  ? "bg-primary text-white border-primary shadow-lg scale-105"
                  : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              🌿 All Products
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => selectCat(cat.slug)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all border-2 ${
                  selectedCategory === cat.slug
                    ? "bg-primary text-white border-primary shadow-lg scale-105"
                    : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                <span className="text-base">{cat.icon}</span> {cat.name}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="container-nursery py-10">

        {/* ── Breadcrumb ── */}
        <Breadcrumb
          category={selectedCategory} crop={selectedCrop}
          catName={catName} cropName={cropName}
          onReset={resetAll} onBackToCrops={backToCrops}
        />

        {/* ══════════════════════════════════════════
            STEP 2 — Crops Grid
        ══════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {showCropsGrid && (
            <motion.div
              key="crops-grid"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    {catName} Crops
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    {visibleCrops.length} crops available — click one to see varieties
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {visibleCrops.map((crop, i) => (
                  <motion.button
                    key={crop.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => selectCrop(crop.slug)}
                    className="group bg-card rounded-2xl overflow-hidden border-2 border-border hover:border-primary hover:shadow-xl transition-all text-left"
                  >
                    <div className="h-36 overflow-hidden bg-muted">
                      <img
                        src={crop.image_url || cropFallback(crop.slug)}
                        alt={crop.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-bold text-foreground text-base group-hover:text-primary transition-colors">
                        {crop.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{crop.varieties} varieties</p>
                      <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold mt-2">
                        Explore <Arrow className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════
              STEP 3 — Varieties Grid
          ══════════════════════════════════════════ */}
          {showVarieties && (
            <motion.div
              key="varieties-grid"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex gap-8">

                {/* ── Sidebar ── */}
                <aside className="hidden lg:block w-64 shrink-0">
                  <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-5 sticky top-28 space-y-6">

                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-primary" /> Filters
                      </h3>
                      {(selectedCategory || selectedCrop || search) && (
                        <button onClick={resetAll} className="text-xs text-primary hover:underline font-semibold">
                          Clear All
                        </button>
                      )}
                    </div>

                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search varieties..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      />
                    </div>

                    {/* Categories */}
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Category</p>
                      <div className="space-y-1">
                        <button
                          onClick={resetAll}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                            !selectedCategory ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          All Categories
                        </button>
                        {categories.map(c => (
                          <button
                            key={c.id}
                            onClick={() => selectCat(c.slug)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                              selectedCategory === c.slug ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            <span>{c.icon}</span> {c.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Crops */}
                    {visibleCrops.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Crop</p>
                        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                          <button
                            onClick={backToCrops}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                              !selectedCrop ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            All Crops
                          </button>
                          {visibleCrops.map(c => (
                            <button
                              key={c.id}
                              onClick={() => selectCrop(c.slug)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                                selectedCrop === c.slug ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </aside>

                {/* ── Main Content ── */}
                <div className="flex-1 min-w-0">

                  {/* Mobile filter bar */}
                  <div className="lg:hidden flex gap-2 mb-5">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text" placeholder="Search..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => setShowMobileFilter(v => !v)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium"
                    >
                      <SlidersHorizontal className="w-4 h-4" /> Filter
                    </button>
                  </div>

                  {/* Mobile filter panel */}
                  <AnimatePresence>
                    {showMobileFilter && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="lg:hidden bg-card border border-border rounded-2xl p-4 mb-5 overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-2">
                          <button onClick={resetAll} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${!selectedCategory ? "bg-primary text-white border-primary" : "border-border text-muted-foreground"}`}>All</button>
                          {categories.map(c => (
                            <button key={c.id} onClick={() => selectCat(c.slug)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selectedCategory === c.slug ? "bg-primary text-white border-primary" : "border-border text-muted-foreground"}`}>
                              {c.icon} {c.name}
                            </button>
                          ))}
                          {visibleCrops.map(c => (
                            <button key={c.id} onClick={() => selectCrop(c.slug)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selectedCrop === c.slug ? "bg-accent text-white border-accent" : "border-border text-muted-foreground"}`}>
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Results header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground">
                        {selectedCrop ? `${cropName} Varieties` : selectedCategory ? `${catName} Varieties` : "All Varieties"}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {loadingV ? "Loading..." : `${varieties.length} varieties found`}
                      </p>
                    </div>
                    {selectedCrop && (
                      <button
                        onClick={backToCrops}
                        className="hidden lg:flex items-center gap-1.5 text-sm text-primary border border-primary/30 px-4 py-2 rounded-full hover:bg-primary/10 transition-colors font-semibold"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back to Crops
                      </button>
                    )}
                  </div>

                  {/* Grid */}
                  {loadingV ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-card rounded-2xl border border-border/50 h-80 animate-pulse" />
                      ))}
                    </div>
                  ) : paginated.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {paginated.map((v, i) => (
                        <motion.div
                          key={v.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                        >
                          <ProductCard variety={v} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-24 bg-card rounded-2xl border border-border/50">
                      <p className="text-5xl mb-4">🌱</p>
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">No varieties found</h3>
                      <p className="text-muted-foreground mb-5">Try adjusting your filters or search terms</p>
                      <button onClick={resetAll} className="text-primary font-semibold hover:underline">Clear all filters</button>
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all ${
                            currentPage === i + 1
                              ? "gradient-cta text-primary-foreground shadow-card"
                              : "border border-border text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
