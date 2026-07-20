import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Medal, Users, Truck, Sprout, ShieldCheck, FlaskConical, Clock3, Star, Quote, ChevronLeft, ChevronRight, Trophy, Dna, PackageCheck, BadgeDollarSign, Leaf, CheckCircle2, HeartHandshake, MapPin } from "lucide-react";
import { Icon } from "@iconify/react";
import heroVideo from "@/assets/Hero-nursery.mp4";
import ProductCard from "@/components/ProductCard";
import { useCountUp } from "@/hooks/useCountUp";
import { useState, useRef, useEffect } from "react";
import FarmerTestimonialVideos from "@/components/FarmerTestimonialVideos";
import { useLanguage } from "@/context/LanguageContext";
import { fetchCategories, fetchCrops, fetchVarieties, type ApiCategory, type ApiCrop, type ApiVariety } from "@/services/api";
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

function cropImage(v: ApiVariety): string {
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
  
}

function cropImageByCropSlug(slug: string): string {
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
  
}

// Gallery Images
import customerVisit from "@/assets/img/Customer-visit.jpeg";
import img1 from "@/assets/img/IMG-20251221-WA0017.jpg.jpeg";
import img2 from "@/assets/img/IMG-20251221-WA0020.jpg.jpeg";
import img3 from "@/assets/img/IMG-20251221-WA0021.jpg.jpeg";
import img4 from "@/assets/img/IMG-20251221-WA0030.jpg.jpeg";
import img5 from "@/assets/img/IMG-20251221-WA0031.jpg.jpeg";
import img6 from "@/assets/img/IMG-20251221-WA0033.jpg.jpeg";
import img7 from "@/assets/img/IMG-20251221-WA0034.jpg.jpeg";
import img8 from "@/assets/img/IMG-20251221-WA0037.jpg.jpeg";
import img9 from "@/assets/img/IMG-20251221-WA0040.jpg.jpeg";
import img10 from "@/assets/img/IMG-20251221-WA0043.jpg.jpeg";
import img11 from "@/assets/img/IMG-20251221-WA0046.jpg.jpeg";
import processImage from "@/assets/img/Process.png";

const stats = [
  { icon: Medal,        value: 28,    suffix: "+",  labelKey: "yearsExp" },
  { icon: Sprout,       value: 10,    suffix: "L+", labelKey: "plantsSupplied" },
  { icon: Users,        value: 50000, suffix: "+",  labelKey: "happyFarmers" },
  { icon: MapPin,       value: 15,    suffix: "+",  labelKey: "statesCovered" },
];

const whyChooseUs = [
  { icon: ShieldCheck,    titleKey: "diseaseResistant", descKey: "diseaseResistantDesc" },
  { icon: FlaskConical,   titleKey: "advancedGrafting",  descKey: "advancedGraftingDesc" },
  { icon: Clock3,         titleKey: "timelyDelivery",    descKey: "timelyDeliveryDesc" },
  { icon: Star,           titleKey: "premiumQuality",    descKey: "premiumQualityDesc" },
  { icon: Truck,          titleKey: "panIndiaShipping",  descKey: "panIndiaShippingDesc" },
  { icon: HeartHandshake, titleKey: "expertSupport",     descKey: "expertSupportDesc" },
];

const testimonials = [
  { name: "Rajesh Patil", location: "Nashik, Maharashtra", text: "Best grafted tomato seedlings I've ever used. My yield increased by 40% compared to non-grafted plants. Sanap Nursery is my go-to for every season.", rating: 5, crop: "Tomato" },
  { name: "Suresh Kumar", location: "Belgaum, Karnataka", text: "Ordering 30,000+ plants was seamless. The pricing is very competitive and the plants arrived in perfect condition. Highly recommended for serious farmers.", rating: 5, crop: "Chili" },
  { name: "Vinod Sharma", location: "Satara, Maharashtra", text: "The capsicum seedlings from Sanap Nursery have been consistently excellent. Their grafted plants resist wilt disease which saved my entire crop last season.", rating: 5, crop: "Capsicum" },
  { name: "Anand Jadhav", location: "Solapur, Maharashtra", text: "I've been buying from Sanap for 8 years now. Their watermelon seedlings produce the sweetest fruits. The delivery is always on time.", rating: 5, crop: "Watermelon" },
];

const galleryImages = [
  { src: customerVisit, category: "Customer Visit", title: "Customer Farm Visit" },
  { src: img1, category: "Nursery", title: "Our Nursery" },
  { src: img2, category: "Nursery", title: "Seedling Production" },
  { src: img3, category: "Nursery", title: "Quality Plants" },
  { src: img4, category: "Seminar", title: "Farmer Training" },
  { src: img5, category: "Seminar", title: "Knowledge Sharing" },
  { src: img6, category: "Nursery", title: "Grafting Process" },
  { src: img7, category: "Nursery", title: "Plant Care" },
  { src: img8, category: "Customer Visit", title: "Happy Customers" },
  { src: img9, category: "Nursery", title: "Growing Facility" },
  { src: img10, category: "Seminar", title: "Agricultural Workshop" },
  { src: img11, category: "Nursery", title: "Healthy Seedlings" },
];

// ── Category card config ──────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<string, { icon: string; gradient: string }> = {
  vegetables: {
    icon: "mdi:carrot",
    gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
  },
  fruits: {
    icon: "mdi:fruit-watermelon",
    gradient: "bg-gradient-to-br from-orange-400 to-yellow-500",
  },
  flowers: {
    icon: "mdi:flower",
    gradient: "bg-gradient-to-br from-pink-500 to-purple-500",
  },
  "other-plants": {
    icon: "mdi:tree",
    gradient: "bg-gradient-to-br from-emerald-600 to-green-800",
  },
  default: {
    icon: "mdi:leaf",
    gradient: "bg-gradient-to-br from-green-500 to-teal-600",
  },
};

// ── Per-crop emoji chips ───────────────────────────────────────────────────────
const CROP_EMOJI: Record<string, string> = {
  tomato:      "🍅",
  chili:       "🌶️",
  brinjal:     "🍆",
  capsicum:    "🫑",
  cucumber:    "🥒",
  watermelon:  "🍉",
  cabbage:     "🥬",
  cauliflower: "🥦",
  bittergourd: "🌿",
  papaya:      "🍈",
  marigold:    "🌸",
  mango:       "🥭",
  banana:      "🍌",
  pomegranate: "🍎",
  rose:        "🌹",
  jasmine:     "🌼",
  lotus:       "🪷",
};

function StatCard({ stat, label }: { stat: typeof stats[0]; label: string }) {
  const { count, ref } = useCountUp(stat.value);
  return (
    <div ref={ref} className="bg-card rounded-2xl p-6 md:p-8 shadow-elevated text-center hover-lift">
      <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-primary mx-auto mb-3" />
      <p className="text-3xl md:text-4xl font-display font-bold text-foreground">
        {count.toLocaleString()}{stat.suffix}
      </p>
      <p className="text-sm text-muted-foreground font-sans mt-1">{label}</p>
    </div>
  );
}

export default function Index() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [cropSliderPos, setCropSliderPos] = useState(0);
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);
  const [apiCrops, setApiCrops]           = useState<ApiCrop[]>([]);
  const [featuredVarieties, setFeaturedVarieties] = useState<any[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    fetchCategories().then(r => setApiCategories(r.data)).catch(() => {});
    fetchCrops().then(r => setApiCrops(r.data)).catch(() => {});
    fetchVarieties().then(r => {
      setFeaturedVarieties(r.data.slice(0, 6).map(v => ({
        ...v,
        image: cropImage(v),
        minOrderQty: Number(v.min_order_qty) || 1000,
        price15k: Number(v.price_15k) || 0,
        price30k: Number(v.price_30k) || 0,
        priceExFactory: Number(v.price_ex_factory) || 0,
        deliveryLocalCharge: Number(v.delivery_local_charge) || 0,
        delivery250kmCharge: Number(v.delivery_250km_charge) || 0,
        durationDays: Number(v.duration_days) || 28,
        stock: Number(v.stock) || 0,
        cropName: v.crop_name || "",
        availableMonths: v.available_months || [],
      })));
    }).catch(() => {});
  }, []);

  const EXCLUDED_CROPS = ["muskmelon", "sugarcane", "drumstick"];
  const sliderCrops = apiCrops.filter(c => !EXCLUDED_CROPS.includes(c.slug));

  useEffect(() => {
    const interval = setInterval(() => {
      setCropSliderPos(prev => (prev + 1 >= sliderCrops.length - 3 ? 0 : prev + 1));
    }, 2500);
    return () => clearInterval(interval);
  }, [sliderCrops.length]);

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden" id="hero">
        <div className="absolute inset-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/55 to-black/30" />
        </div>

        {/* Removed blur blobs — they were fogging the video */}

        <div className="container-nursery relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-3xl"
          >
            {/* Badge */}
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-black/40 text-white border border-white/30 rounded-full px-5 py-2 text-sm font-semibold mb-8 backdrop-blur-sm drop-shadow-lg"
            >
              <Sprout className="w-4 h-4 text-green-400" /> {t("trustedFarmers")}
            </motion.span>

            {/* Heading */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] mb-6" style={{ textShadow: "0 2px 20px rgba(0,0,0,1), 0 4px 40px rgba(0,0,0,1)" }}>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="block text-white"
              >
                {t("yearsExperience")}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="block text-green-400"
              >
                {t("farmingExcellence")}
              </motion.span>
            </h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-lg md:text-xl text-white mb-10 max-w-xl font-sans leading-relaxed bg-black/50 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/10"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}
            >
              {t("heroDescription")}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/products"
                className="bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 btn-ripple"
              >
                {t("exploreProducts")} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="bg-black/40 backdrop-blur-md border-2 border-white/50 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-black/60 transition-all"
              >
                {t("contactUs")}
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="flex flex-wrap gap-3 mt-12"
            >
              {[
                { Icon: Trophy, key: "isoCertified" },
                { Icon: FlaskConical, key: "japaneseGrafting" },
                { Icon: PackageCheck, key: "panIndiaDelivery" },
                { Icon: BadgeDollarSign, key: "b2bPricing" },
              ].map(({ Icon, key }) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full"
                >
                  <Icon className="w-3.5 h-3.5" /> {t(key)}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        
      </section>

      {/* ===== STATS WITH ANIMATED COUNTERS ===== */}
      <section className="relative -mt-20 z-20 pb-8" id="stats">
        <div className="container-nursery">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.labelKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <StatCard stat={stat} label={t(stat.labelKey)} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED CATEGORIES ===== */}
      <section className="py-20 surface-warm" id="categories">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-[0.2em] font-sans">{t("ourCategories")}</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              {t("whatWeGrow")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t("categoriesDesc")}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {apiCategories.map((cat, i) => {
              const catCrops = apiCrops.filter(c => c.category_slug === cat.slug);
              const totalVarieties = catCrops.reduce((s, c) => s + Number(c.varieties), 0);
              const cfg = CATEGORY_CONFIG[cat.slug] ?? CATEGORY_CONFIG["default"];
              const cropChips = catCrops.slice(0, 4).map(c => ({
                name: c.name,
                emoji: CROP_EMOJI[c.slug] ?? "🌿",
              }));
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, type: "spring", stiffness: 80 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className="group relative flex flex-col bg-card rounded-3xl overflow-hidden border border-border/40 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2"
                    style={{ boxShadow: undefined }}
                  >
                    {/* Gradient top banner */}
                    <div className={`relative h-36 flex items-center justify-center ${cfg.gradient} overflow-hidden`}>
                      {/* Decorative blurred circle */}
                      <div className="absolute w-32 h-32 rounded-full bg-white/10 -top-8 -right-8" />
                      <div className="absolute w-20 h-20 rounded-full bg-white/10 bottom-0 left-4" />
                      {/* Large circular icon container */}
                      <motion.div
                        whileHover={{ rotate: 8, scale: 1.12 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="relative z-10 w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center shadow-lg backdrop-blur-sm"
                      >
                        <Icon icon={cfg.icon} className="w-10 h-10 text-white drop-shadow" />
                      </motion.div>
                      {/* Gradient border glow on hover */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${cfg.gradient} mix-blend-overlay`} />
                    </div>

                    {/* Card body */}
                    <div className="flex flex-col flex-1 p-6">
                      <h3 className="font-display text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>

                      {/* Stats row */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-muted rounded-full px-2.5 py-1">
                          <Icon icon="mdi:sprout" className="w-3.5 h-3.5 text-primary" />
                          {catCrops.length} Crops
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-muted rounded-full px-2.5 py-1">
                          <Icon icon="mdi:seed" className="w-3.5 h-3.5 text-primary" />
                          {totalVarieties} Varieties
                        </span>
                      </div>

                      {/* Crop chips with emoji */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {cropChips.map((chip) => (
                          <span
                            key={chip.name}
                            className="inline-flex items-center gap-1 text-xs bg-secondary/60 text-secondary-foreground rounded-full px-2.5 py-1 font-medium border border-border/30 hover:bg-secondary transition-colors"
                          >
                            <span>{chip.emoji}</span> {chip.name}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="mt-auto flex items-center gap-1.5 text-sm font-bold text-primary group-hover:gap-3 transition-all duration-200">
                        <span className="relative">
                          {t("browseCategory")}
                          <span className="absolute -bottom-0.5 left-0 w-0 group-hover:w-full h-0.5 bg-primary transition-all duration-300 rounded-full" />
                        </span>
                        <motion.span
                          animate={{ x: 0 }}
                          whileHover={{ x: 4 }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURED CROPS SLIDER ===== */}
      <section className="py-20" id="crops-slider">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-[0.2em] font-sans">Popular Crops</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                Our Top Crops
              </h2>
            </div>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => setCropSliderPos(Math.max(0, cropSliderPos - 1))}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCropSliderPos(Math.min(sliderCrops.length - 1, cropSliderPos + 1))}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-6" style={{ transform: `translateX(-${cropSliderPos * 280}px)`, transition: "transform 0.4s ease" }}>
              {sliderCrops.map((crop, i) => (
                <motion.div
                  key={crop.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="min-w-[250px] md:min-w-[280px]"
                >
                  <Link to={`/products?crop=${crop.slug}`} className="block group">
                    <div className="relative rounded-2xl overflow-hidden h-56 mb-4">
                      <img src={crop.image_url || cropImageByCropSlug(crop.slug)} alt={crop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="px-1">
                      <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">{crop.name}</h3>
                      <p className="text-xs text-muted-foreground">{crop.varieties} varieties</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-20 surface-green" id="featured-products">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-[0.2em] font-sans">{t("bestSellers")}</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              {t("featuredVarieties")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t("featuredDesc")}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVarieties.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <ProductCard variety={v} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 gradient-cta text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:shadow-elevated transition-all hover:scale-105 btn-ripple"
            >
              {t("viewAllProducts")} <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-20" id="why-choose-us">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-[0.2em] font-sans">{t("ourAdvantages")}</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              {t("whyChooseUs")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={item.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-8 hover-lift group"
              >
                <div className="w-14 h-14 rounded-2xl gradient-cta flex items-center justify-center mb-5 group-hover:shadow-glow transition-all">
                  <item.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{t(item.titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(item.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GRAFTING PROCESS PREVIEW ===== */}
<section className="py-20 surface-warm" id="grafting-preview">
  <div className="container-nursery">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-14"
    >
      <span className="text-sm font-semibold text-green-500 uppercase tracking-[0.2em] font-sans">Our Technology</span>
      <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
        Advanced Grafting Process
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Combining the best qualities of two plants into one stronger, more productive unit using Japanese grafting technology.
      </p>
    </motion.div>

    {/* Balanced Left/Right Grid to match image_2a863c.png layout */}
    <div className="grid md:grid-cols-2 gap-8 items-start max-w-6xl mx-auto mb-12">
      
      {/* LEFT COLUMN: Structural Components */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        {/* Top Split Rows: Scion & Rootstock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-6 rounded-2xl border border-green-200/60 bg-white shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center mb-4">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Scion</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Upper portion producing quality fruits
            </p>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-green-200/60 bg-white shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center mb-4">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Rootstock</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Strong roots with disease resistance
            </p>
          </div>
        </div>

        {/* Highlight Result Row */}
        <div className="bg-card p-6 rounded-2xl border border-red-200/60 bg-white shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-green-600 mb-1">Result: Superior Plant</h3>
            <p className="text-sm text-muted-foreground">
              98%+ survival rate with higher yields
            </p>
          </div>
        </div>
      </motion.div>

      {/* RIGHT COLUMN: Clean Benefit Rows Stack */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        {[
          { icon: ShieldCheck, title: "Disease Protection", desc: "Protects from soil-borne diseases" },
          { icon: Sprout,      title: "Stronger Growth",    desc: "Enhanced root system and vigor" },
          { icon: Star,        title: "Higher Yield",       desc: "Increased production and quality" },
        ].map((benefit, i) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
              <benefit.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-display font-bold text-foreground text-base mb-0.5">{benefit.title}</h4>
              <p className="text-sm text-muted-foreground">{benefit.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>

    {/* Clean CTA Trigger Button */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <Link
        to="/grafting"
        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105"
      >
        Learn About Grafting <ArrowRight className="w-5 h-5" />
      </Link>
    </motion.div>
  </div>
</section>

      {/* ===== PROCESS DIAGRAM ===== */}
      <section className="py-20" id="process-preview">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-[0.2em] font-sans">Our Methodology</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Complete Process
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">From seed selection to dispatch - our 10-step quality process ensures premium grafted seedlings</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto mb-12"
          >
            <Link to="/process" className="block group">
              <div className="relative rounded-3xl overflow-hidden shadow-elevated hover:shadow-2xl transition-all">
                <img 
                  src={processImage} 
                  alt="Complete Grafting Process" 
                  className="w-full group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-8 left-8 right-8 translate-y-4 group-hover:translate-y-0 transition-transform">
                  <p className="text-primary-foreground font-semibold text-lg md:text-xl drop-shadow-lg">
                    Click to view detailed 11-step process →
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/process"
              className="inline-flex items-center gap-2 gradient-cta text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:shadow-elevated transition-all hover:scale-105 btn-ripple"
            >
              View Detailed Process <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              15 days from grafting to dispatch with 98%+ success rate
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== B2B PRICING TIERS ===== */}
      <section className="py-20 gradient-hero text-primary-foreground" id="pricing">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <span className="text-sm font-semibold text-accent uppercase tracking-[0.2em] font-sans">{t("transparentPricing")}</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-3 mb-4">
              {t("bulkOrderPricing")}
            </h2>
            <p className="text-lg text-primary-foreground/70">
              {t("pricingDesc")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { tier: "Ex-Factory", qty: "< 15,000 Plants", price: "From ₹3.5/plant", desc: "Standard pricing for smaller orders", highlight: false },
              { tier: "Bulk Order", qty: "15,000+ Plants", price: "From ₹2.5/plant", desc: "Best value for medium-scale farmers", highlight: true },
              { tier: "Mega Order", qty: "30,000+ Plants", price: "From ₹1.8/plant", desc: "Maximum savings for large operations", highlight: false },
            ].map((tier, i) => (
              <motion.div
                key={tier.tier}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className={`rounded-2xl p-8 text-center transition-all ${
                  tier.highlight
                    ? "bg-primary-foreground text-foreground scale-105 shadow-elevated border-4 border-accent"
                    : "bg-primary-foreground/10 border border-primary-foreground/20 hover:bg-primary-foreground/15"
                }`}
              >
                {tier.highlight && (
                  <span className="inline-flex items-center gap-1.5 gradient-gold text-white text-xs font-bold px-4 py-1 rounded-full mb-4">
                    <Star className="w-3 h-3 fill-white" /> MOST POPULAR
                  </span>
                )}
                <h3 className={`font-display text-2xl font-bold mb-2 ${tier.highlight ? "text-primary" : ""}`}>
                  {tier.tier}
                </h3>
                <p className={`text-sm mb-3 ${tier.highlight ? "text-muted-foreground" : "text-primary-foreground/60"}`}>{tier.qty}</p>
                <p className={`text-3xl font-bold mb-4 ${tier.highlight ? "text-primary" : ""}`}>{tier.price}</p>
                <p className={`text-sm ${tier.highlight ? "text-muted-foreground" : "text-primary-foreground/60"}`}>
                  {tier.desc}
                </p>
                <Link
                  to="/products"
                  className={`inline-block mt-6 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105 ${
                    tier.highlight
                      ? "gradient-cta text-primary-foreground hover:shadow-elevated"
                      : "border border-primary-foreground/30 hover:bg-primary-foreground/10"
                  }`}
                >
                  Order Now
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 surface-warm" id="testimonials">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-[0.2em] font-sans">What Farmers Say</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">
              Testimonials
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-3xl p-8 md:p-12 shadow-elevated border border-border/50 relative"
            >
              <Quote className="w-12 h-12 text-primary/15 absolute top-6 right-8" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-lg md:text-xl text-foreground leading-relaxed mb-6 font-sans">
                "{testimonials[currentTestimonial].text}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-foreground text-lg">{testimonials[currentTestimonial].name}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].location} · {testimonials[currentTestimonial].crop} Farmer</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentTestimonial(currentTestimonial > 0 ? currentTestimonial - 1 : testimonials.length - 1)}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentTestimonial((currentTestimonial + 1) % testimonials.length)}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentTestimonial ? "bg-primary w-8" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY PREVIEW ===== */}
      <section className="py-20 overflow-hidden" id="gallery">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="text-sm font-semibold text-primary uppercase tracking-[0.2em] font-sans inline-block"
            >
              Our Journey
            </motion.span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Gallery
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Explore our nursery, customer visits, and farmer training seminars</p>
          </motion.div>

          {/* 2 Featured Images */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
            {galleryImages.slice(0, 2).map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="group relative rounded-3xl overflow-hidden shadow-elevated hover:shadow-2xl transition-all cursor-pointer hover-lift"
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground text-xs font-bold px-4 py-2 rounded-full mb-3 shadow-lg">
                      <PackageCheck className="w-3 h-3" /> {img.category}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground drop-shadow-lg">
                      {img.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View Gallery Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 gradient-cta text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:shadow-elevated transition-all hover:scale-105 btn-ripple"
            >
              View Full Gallery <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              {galleryImages.length}+ photos from our nursery, events & customer visits
            </p>
          </motion.div>
        </div>
      </section>

      
      {/* ===== CTA SECTION ===== */}
      <section className="py-20 surface-green" id="cta">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gradient-hero rounded-3xl p-10 md:p-16 text-primary-foreground text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary-foreground/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                {t("readyToOrder")}
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                {t("ctaDesc")}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/products"
                  className="gradient-gold text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-gold transition-all hover:scale-105 btn-ripple"
                >
                  {t("browseCatalog")}
                </Link>
                <a
                  href="https://wa.me/919823044556"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-foreground/10 backdrop-blur-sm border-2 border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-foreground/20 transition-all"
                >
                  {t("whatsappUs")}
                </a>
                <a
                  href="tel:+919823044556"
                  className="bg-primary-foreground/10 backdrop-blur-sm border-2 border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-foreground/20 transition-all"
                >
                  {t("callNow")}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
