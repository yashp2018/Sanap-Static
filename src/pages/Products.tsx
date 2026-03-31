import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { fetchCategories, fetchCrops, fetchVarieties, ApiCategory, ApiCrop } from "@/services/api";
import { sampleVarieties } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import VarietyComparison from "@/components/VarietyComparison";
import PDFCatalogDownload from "@/components/PDFCatalogDownload";

const ITEMS_PER_PAGE = 6;

export default function Products() {
  const [searchParams]  = useSearchParams();
  const [search, setSearch]                   = useState("");
  // URL params from Index.tsx use local data ids (e.g. "vegetables", "tomato")
  // which match the slug values in the API — so we use them directly
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedCrop, setSelectedCrop]         = useState(searchParams.get("crop") || "");
  const [currentPage, setCurrentPage]           = useState(1);

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [crops, setCrops]           = useState<ApiCrop[]>([]);
  const [varieties, setVarieties]   = useState<any[]>([]);
  const [loadingV, setLoadingV]     = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("");

  const REGIONS: Record<string, string[]> = {
    "Maharashtra": ["tomato","chili","brinjal","capsicum","watermelon","cucumber","marigold"],
    "Karnataka":   ["tomato","chili","capsicum","cucumber","watermelon"],
    "Andhra Pradesh": ["chili","tomato","brinjal","watermelon"],
    "Tamil Nadu":  ["tomato","brinjal","watermelon","cucumber"],
    "Gujarat":     ["tomato","chili","capsicum","watermelon","muskmelon"],
    "Rajasthan":   ["tomato","chili","watermelon","muskmelon"],
  };

  // Load categories + crops once
  useEffect(() => {
    fetchCategories().then(r => setCategories(r.data)).catch(() => {});
    fetchCrops().then(r => setCrops(r.data)).catch(() => {});
  }, []);

  // Load varieties whenever filters change
  useEffect(() => {
    setLoadingV(true);
    fetchVarieties({
      category: selectedCategory || undefined,
      crop:     selectedCrop     || undefined,
      search:   search           || undefined,
    })
      .then(r => { 
        const frontendVarieties = r.data.map(v => ({
          ...v,
          // camelCase aliases expected by ProductCard / local helpers
          minOrderQty:         Number(v.min_order_qty)          || 1000,
          price15k:            Number(v.price_15k)              || 0,
          price30k:            Number(v.price_30k)              || 0,
          priceExFactory:      Number(v.price_ex_factory)       || 0,
          deliveryLocalCharge: Number(v.delivery_local_charge)  || 0,
          delivery250kmCharge: Number(v.delivery_250km_charge)  || 0,
          durationDays:        Number(v.duration_days)          || 28,
          stock:               Number(v.stock)                  || 0,
          image:               v.image_url || '/SA.png',
          availableMonths:     v.available_months || [],
          cropName:            v.crop_name  || '',
          company:             v.company    || '',
          name:                v.name       || '',
        }));
        setVarieties(frontendVarieties); 
        setCurrentPage(1); 
      })
      .catch(() => setVarieties([]))
      .finally(() => setLoadingV(false));
  }, [selectedCategory, selectedCrop, search]);

  const totalPages = Math.ceil(varieties.length / ITEMS_PER_PAGE);
  // Apply regional filter client-side
  const regionFiltered = selectedRegion
    ? varieties.filter(v => (REGIONS[selectedRegion] || []).includes(v.crop_slug || v.cropId || ""))
    : varieties;
  const paginated  = regionFiltered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPagesFiltered = Math.ceil(regionFiltered.length / ITEMS_PER_PAGE);
  const visibleCrops = selectedCategory
    ? crops.filter(c => c.category_slug === selectedCategory)
    : crops;

  const clearFilters = () => {
    setSelectedCategory(""); setSelectedCrop(""); setSearch(""); setSelectedRegion(""); setCurrentPage(1);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-background py-16">
        <div className="container-nursery">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Product Catalogue</h1>
            <p className="text-xl text-accent font-semibold mb-8">Select a Category</p>
          </motion.div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 bg-muted/30 rounded-full p-3 max-w-5xl mx-auto">
            <button
              onClick={() => { setSelectedCategory(""); setSelectedCrop(""); setCurrentPage(1); }}
              className={`px-8 py-3 rounded-full font-semibold text-base transition-all ${
                !selectedCategory
                  ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg"
                  : "text-primary hover:bg-muted"
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.slug); setSelectedCrop(""); setCurrentPage(1); }}
                className={`px-8 py-3 rounded-full font-semibold text-base transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg"
                    : "text-primary hover:bg-muted"
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container-nursery py-10">
        {/* Crops Grid */}
        {selectedCategory && !selectedCrop && (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleCrops.map(crop => (
                <motion.div
                  key={crop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border-2 border-accent/30 rounded-3xl p-6 hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => { setSelectedCrop(crop.slug); setCurrentPage(1); }}
                >
                  <h3 className="font-display text-2xl font-bold text-primary mb-2">{crop.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{crop.varieties} varieties available</p>
                  {crop.image_url && (
                    <img src={crop.image_url} alt={crop.name} className="w-full h-32 object-cover rounded-xl" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6 sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-foreground text-lg">Filters</h3>
                {(selectedCategory || selectedCrop || search) && (
                  <button onClick={clearFilters} className="text-xs text-primary hover:underline font-semibold">
                    Clear All
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search varieties..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>

              {/* Region Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Region / State</h4>
                <select
                  value={selectedRegion}
                  onChange={e => { setSelectedRegion(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">All Regions</option>
                  {Object.keys(REGIONS).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Categories</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => { setSelectedCategory(""); setSelectedCrop(""); setCurrentPage(1); }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                      !selectedCategory ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedCategory(c.slug); setSelectedCrop(""); setCurrentPage(1); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 ${
                        selectedCategory === c.slug ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <span>{c.icon}</span> {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crops */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Crops</h4>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => { setSelectedCrop(""); setCurrentPage(1); }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                      !selectedCrop ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    All Crops
                  </button>
                  {visibleCrops.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedCrop(c.slug); setCurrentPage(1); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                        selectedCrop === c.slug ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Mobile filters */}
            <div className="lg:hidden flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={e => { setSelectedCategory(e.target.value); setSelectedCrop(""); setCurrentPage(1); }}
                className="px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm"
              >
                <option value="">Category</option>
                {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
              <select
                value={selectedCrop}
                onChange={e => { setSelectedCrop(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm"
              >
                <option value="">Crop</option>
                {visibleCrops.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{paginated.length}</span> of{" "}
                <span className="font-semibold text-foreground">{regionFiltered.length}</span> varieties
                {selectedRegion && <span className="text-primary font-semibold"> in {selectedRegion}</span>}
              </p>
              <div className="flex items-center gap-3">
                {(selectedCategory || selectedCrop || search) && (
                  <button onClick={clearFilters} className="text-sm text-primary hover:underline font-semibold lg:hidden">
                    Clear Filters
                  </button>
                )}
                <PDFCatalogDownload varieties={sampleVarieties} categoryName={selectedCategory || undefined} />
              </div>
            </div>

            {/* Grid */}
            {loadingV ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl border border-border/50 h-80 animate-pulse" />
                ))}
              </div>
            ) : paginated.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginated.map((v, i) => (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <ProductCard variety={v} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-2xl border border-border/50">
                <p className="text-5xl mb-4">🌱</p>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">No varieties found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="text-primary font-semibold hover:underline">Clear all filters</button>
              </div>
            )}

            {/* Pagination */}
            {totalPagesFiltered > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPagesFiltered }).map((_, i) => (
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
                  onClick={() => setCurrentPage(Math.min(totalPagesFiltered, currentPage + 1))}
                  disabled={currentPage === totalPagesFiltered}
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Variety Comparison Tool */}
            <div className="mt-12">
              <VarietyComparison varieties={sampleVarieties} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
