import { motion, useScroll, useTransform } from "framer-motion";
import { Sprout, Shield, TrendingUp, Droplet, CheckCircle, ArrowRight, Leaf, ChevronDown, ChevronUp, FlaskConical, Thermometer, Sun, Scissors, HeartPulse, PackageCheck, Star, Award, Microscope } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import graftingHero from "@/assets/Grafting-1.png";

import tomatoImg from "@/assets/vegetables/Max.png";
import brinjalImg from "@/assets/vegetables/Brinjal.png";
import watermelonImg from "@/assets/vegetables/Watermelon.png";
import cucumberImg from "@/assets/vegetables/cucumber.png";
import capsicumImg from "@/assets/vegetables/Capsicum.png";
import bitterGourdImg from "@/assets/vegetables/bitter Gourd.png";
import processImg from "@/assets/img/Process.png";

// Nursery real photos for gallery
import g1 from "@/assets/img/IMG-20251221-WA0017.jpg.jpeg";
import g2 from "@/assets/img/IMG-20251221-WA0020.jpg.jpeg";
import g3 from "@/assets/img/IMG-20251221-WA0021.jpg.jpeg";
import g4 from "@/assets/img/IMG-20251221-WA0030.jpg.jpeg";
import g5 from "@/assets/img/IMG-20251221-WA0031.jpg.jpeg";
import g6 from "@/assets/img/IMG-20251221-WA0033.jpg.jpeg";

const vegetables = [
  { name: "Tomato", img: tomatoImg, rootstock: "Solanum torvum / Solanum sisymbriifolium", benefit: "Resistance to bacterial wilt, Fusarium, nematodes" },
  { name: "Brinjal", img: brinjalImg, rootstock: "Solanum torvum", benefit: "Resistance to bacterial wilt and soil-borne diseases" },
  { name: "Watermelon", img: watermelonImg, rootstock: "Bottle gourd / Squash", benefit: "Resistance to Fusarium wilt, better water uptake" },
  { name: "Cucumber", img: cucumberImg, rootstock: "Figleaf gourd / Pumpkin", benefit: "Tolerance to low temperature and soil diseases" },
  { name: "Capsicum", img: capsicumImg, rootstock: "Solanum torvum", benefit: "Resistance to Phytophthora and bacterial wilt" },
  { name: "Bitter Gourd", img: bitterGourdImg, rootstock: "Wild bitter gourd", benefit: "Improved vigor and disease resistance" },
];

const benefits = [
  { icon: Shield, title: "Disease Protection", desc: "Grafted plants are highly resistant to soil-borne diseases like bacterial wilt, Fusarium wilt, and root-knot nematodes that destroy normal crops." },
  { icon: Sprout, title: "Stronger Root System", desc: "The rootstock provides a powerful, deep root system that absorbs more water and nutrients, resulting in healthier and more vigorous plants." },
  { icon: TrendingUp, title: "Higher Yield", desc: "Farmers report 30–50% higher yield from grafted plants compared to normal seedlings due to better plant health and longer crop duration." },
  { icon: Droplet, title: "Stress Tolerance", desc: "Grafted plants can survive in challenging conditions — heat stress, salinity, waterlogging, and poor soil quality — where normal plants fail." },
  { icon: Leaf, title: "Longer Crop Duration", desc: "Grafted plants stay productive for a longer period, giving farmers more harvests per season and better return on investment." },
  { icon: CheckCircle, title: "Reduced Chemical Use", desc: "Because grafted plants are naturally disease-resistant, farmers need fewer pesticides and fungicides, reducing costs and environmental impact." },
];

const steps = [
  { step: "01", title: "Premium Seed Selection", desc: "Only certified, high-germination seeds from trusted breeders are selected for both rootstock and scion varieties.", icon: Star },
  { step: "02", title: "Pre-Sowing Seed Treatment", desc: "Seeds undergo fungicide treatment, priming, and quality checks to maximize germination rate and seedling uniformity.", icon: FlaskConical },
  { step: "03", title: "Precision Tray Sowing", desc: "Seeds are sown in sterilized pro-trays with premium cocopeat media under controlled nursery conditions.", icon: Sprout },
  { step: "04", title: "Germination Chamber", desc: "Trays are placed in temperature-controlled germination chambers maintaining optimal humidity and warmth for uniform sprouting.", icon: Thermometer },
  { step: "05", title: "Healthy Seedling Development", desc: "Seedlings are nurtured with balanced nutrition, proper irrigation, and pest monitoring until they reach grafting stage.", icon: Leaf },
  { step: "06", title: "Vegetable Grafting", desc: "Expert grafters join the high-yielding scion with disease-resistant rootstock using precision tongue-approach grafting technique.", icon: Scissors, highlight: true },
  { step: "07", title: "Healing Chamber", desc: "Grafted plants are placed in high-humidity healing tunnels (85%+ RH) at 25–30°C with controlled light for 7 days.", icon: HeartPulse },
  { step: "08", title: "Hardening Process", desc: "Plants are gradually acclimatized to ambient conditions over 3–5 days, building resilience for field transplanting.", icon: Sun },
  { step: "09", title: "Quality Inspection", desc: "Every batch undergoes rigorous visual and physical inspection — only plants meeting our quality standards are approved.", icon: Microscope },
  { step: "10", title: "Packing & Delivery", desc: "Approved plants are carefully packed in ventilated trays and dispatched with temperature-safe logistics across India.", icon: PackageCheck },
];

const galleryPhotos = [g1, g2, g3, g4, g5, g6];

const faqs = [
  { q: "Is grafting a natural process?", a: "Yes. Grafting is a completely natural plant propagation technique. No genetic modification (GMO) is involved. It simply combines two compatible plants so they grow together as one." },
  { q: "Does grafting change the taste or quality of the fruit?", a: "No. The fruit quality, taste, colour, and variety characteristics are determined entirely by the scion (upper part). The rootstock only influences plant health and vigour." },
  { q: "Are grafted seedlings more expensive?", a: "Grafted seedlings cost slightly more than regular seedlings, but the investment is recovered quickly through higher yield, fewer crop losses, and reduced pesticide costs." },
  { q: "Which crops benefit most from grafting?", a: "Tomato, brinjal, watermelon, cucumber, capsicum, and bitter gourd benefit the most. These crops are highly susceptible to soil-borne diseases that grafting effectively prevents." },
  { q: "How long does a grafted plant live compared to a normal plant?", a: "Grafted plants typically have a 30–50% longer productive life than normal plants, giving farmers more harvests per crop cycle." },
];

function GraftingHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  return (
    <section
      ref={ref}
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: "clamp(500px, 70vh, 650px)" }}
    >
      {/* Parallax image */}
      <motion.div
        className="absolute inset-0 w-full"
        style={{ y: bgY, height: "120%", top: "-10%" }}
      >
        <img
          src={graftingHero}
          alt="Sanap Hi-Tech Nursery Grafting"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.55) 100%)" }}
      />
      {/* Content */}
      <div className="container-nursery relative z-10 flex items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl w-full text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold mb-5 text-white border border-white/30"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          >
            Advanced Agriculture Technology
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="font-display text-5xl md:text-7xl font-bold text-white mb-5"
            style={{ textShadow: "0 2px 30px rgba(0,0,0,0.6), 0 1px 6px rgba(0,0,0,0.4)" }}
          >
            Vegetable Grafting
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-lg md:text-xl leading-relaxed text-white/90 max-w-xl mx-auto mb-8"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
          >
            The science of combining two plants into one — stronger roots, better yield, and natural disease resistance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="flex flex-wrap justify-center gap-8"
          >
            {[["98%", "Success Rate"], ["30-50%", "Higher Yield"], ["100%", "Natural Process"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="font-display text-3xl font-bold text-white" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{val}</div>
                <div className="text-sm text-white/80 mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Grafting() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <GraftingHero />

      {/* What is Grafting */}
      <section className="py-20 surface-warm">
        <div className="container-nursery">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">What is Grafting?</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Two Plants, One Powerful Unit
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Grafting is the process of joining two different plants so they grow together as one healthy plant. This technique has been practiced for centuries in fruit crops and is now widely used in vegetable cultivation.
                </p>
                <p>
                  Take a <strong className="text-foreground">disease-resistant rootstock</strong> and combine it with a <strong className="text-foreground">high-yielding scion variety</strong>. The result is a single plant with the best of both.
                </p>
                <p>
                  This is a <strong className="text-foreground">completely natural method — no genetic modification involved.</strong> Grafting improves the plant from below (root level).
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-card rounded-2xl p-5 border border-border shadow-card">
                  <div className="w-10 h-10 rounded-xl gradient-cta flex items-center justify-center mb-3">
                    <Leaf className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-base font-bold text-primary mb-1">Scion</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">Upper part — determines fruit taste, colour & quality.</p>
                </div>
                <div className="bg-card rounded-2xl p-5 border border-border shadow-card">
                  <div className="w-10 h-10 rounded-xl gradient-cta flex items-center justify-center mb-3">
                    <Sprout className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-base font-bold text-primary mb-1">Rootstock</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">Lower part — provides disease resistance & strong roots.</p>
                </div>
              </div>
            </motion.div>

            {/* Grafting.png visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-elevated">
                <img
                  src="/Grafting.png"
                  alt="Vegetable grafting illustration"
                  className="w-full h-80 md:h-[420px] object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card rounded-2xl shadow-elevated px-5 py-3 border border-border">
                <p className="text-xs text-muted-foreground">Success Rate</p>
                <p className="font-display text-2xl font-bold text-primary">98%+</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vegetables We Graft — Cards with images */}
      <section className="py-20">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Vegetables We Graft
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We specialize in grafting the most commercially important vegetable crops using proven rootstock varieties.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vegetables.map((v, i) => (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl border border-border shadow-card hover-lift overflow-hidden"
              >
                <div className="h-44 bg-muted/30 flex items-center justify-center p-4">
                  <img
                    src={v.img}
                    alt={v.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-foreground mb-1">{v.name}</h3>
                  <p className="text-xs text-primary italic mb-2">{v.rootstock}</p>
                  <p className="text-sm text-muted-foreground">{v.benefit}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 surface-green">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Why Choose Grafted Seedlings?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Grafted plants give farmers a significant advantage in yield, disease management, and profitability.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 shadow-card hover-lift"
              >
                <div className="w-12 h-12 rounded-xl gradient-cta flex items-center justify-center mb-4">
                  <b.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR GRAFTING PROCESS ===== */}
      <section className="py-20" id="grafting-process">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-[0.2em] font-sans">Our Methodology</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Our Grafting Process
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A precise, 10-step nursery production process carried out by trained experts to ensure 98%+ graft success rate.
            </p>
          </motion.div>

          {/* Main Layout: Steps Left (40%) + Image Right (60%) */}
          <div className="flex flex-col lg:flex-row gap-10 items-start max-w-7xl mx-auto">

            {/* LEFT: 10 Process Cards */}
            <div className="w-full lg:w-[40%] space-y-3">
              {steps.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  viewport={{ once: true }}
                  className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all hover:shadow-md ${
                    s.highlight
                      ? "bg-green-50 border-green-400 shadow-md ring-1 ring-green-300"
                      : "bg-card border-l-4 border-l-green-500 border-border/60 hover:border-green-300"
                  }`}
                >
                  {/* Step Number */}
                  <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-display font-bold text-sm shadow-sm ${
                    s.highlight ? "bg-green-500 text-white" : "gradient-cta text-primary-foreground"
                  }`}>
                    {s.step}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-display font-bold text-sm leading-tight ${
                        s.highlight ? "text-green-700" : "text-foreground"
                      }`}>{s.title}</h3>
                      {s.highlight && (
                        <span className="inline-flex items-center gap-1 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                          <Award className="w-2.5 h-2.5" /> Most Important Step
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>

                  {/* Icon */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    s.highlight ? "bg-green-100" : "bg-primary/8"
                  }`}>
                    <s.icon className={`w-4 h-4 ${s.highlight ? "text-green-600" : "text-primary"}`} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* RIGHT: Sticky Process Infographic */}
            <div className="w-full lg:w-[60%]">
              <div className="lg:sticky lg:top-24">
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="group relative rounded-3xl overflow-hidden shadow-elevated border border-green-100 hover:shadow-2xl transition-all duration-500"
                >
                  <img
                    src={processImg}
                    alt="Complete Nursery Production Process"
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>

                {/* Stats below image */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3"
                >
                  {[
                    { value: "98%", label: "Grafting Success" },
                    { value: "✓", label: "Disease Resistant Plants" },
                    { value: "30–50%", label: "Higher Yield" },
                    { value: "✓", label: "Long Crop Duration" },
                    { value: "✓", label: "Better Root System" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.07 }}
                      viewport={{ once: true }}
                      className="bg-card rounded-xl p-3 border border-green-100 shadow-sm text-center hover:border-green-300 transition-colors"
                    >
                      <p className="font-display font-bold text-green-600 text-lg leading-none mb-1">{stat.value}</p>
                      <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nursery Photo Gallery */}
      <section className="py-20 surface-warm">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Inside Our Nursery
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A glimpse of our grafting facility and the care that goes into every seedling.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryPhotos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 }}
                viewport={{ once: true }}
                className="rounded-2xl overflow-hidden shadow-card hover-lift aspect-square"
              >
                <img
                  src={photo}
                  alt={`Nursery photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container-nursery max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">Common questions farmers ask about grafted seedlings.</p>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-foreground pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="container-nursery text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Ready to Grow Stronger Crops?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Order our premium grafted seedlings and experience the difference — higher yield, fewer losses, better profits.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:shadow-elevated transition-all hover:scale-105"
              >
                Browse Grafted Seedlings <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border-2 border-white/60 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
