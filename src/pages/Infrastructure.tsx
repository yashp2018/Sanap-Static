import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import infraHero from "@/assets/Infrasturcture.png";

const infrastructureItems = [
  {
    title: "Seedling Tray Manufacturing",
    description: "We manufacture high-quality seedling trays in-house for complete control over quality. Each tray is filled with premium coco peat and designed for optimal germination. Our trays ensure excellent nutrient availability and easy transplantation, with each cavity containing 1-2 seedlings for healthy root development.",
    images: [
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop"
    ]
  },
  {
    title: "Advanced Polyhouses",
    description: "Our state-of-the-art polyhouses feature climate-controlled environments for year-round seedling production. Temperature, humidity, and light are automatically regulated to ensure optimal growing conditions. Special dark rooms and nutrient beds provide the perfect environment for seedling development with 98%+ success rates.",
    images: [
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop"
    ]
  },
  {
    title: "Automated Irrigation System",
    description: "Our precision irrigation system uses automatic fogger technology to deliver exact water and nutrient dosages. This computer-controlled system prevents over-watering or under-watering, ensuring uniform growth across all seedlings. The system optimizes water usage while maintaining perfect moisture levels.",
    images: [
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop"
    ]
  },
  {
    title: "Automatic Seeder Machine",
    description: "Our imported automatic seeder machines ensure precise seed placement in each tray cavity. The machines are calibrated for different seed sizes and types, guaranteeing consistent germination rates. This automation increases efficiency while maintaining the highest quality standards.",
    images: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=400&h=300&fit=crop"
    ]
  },
  {
    title: "Quality Control Laboratory",
    description: "Our in-house laboratory conducts regular testing of seedling health, nutrient levels, and disease resistance. Every batch undergoes strict quality checks before dispatch. We maintain detailed records to ensure traceability and consistent quality across all our products.",
    images: [
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=300&fit=crop"
    ]
  }
];

function ParallaxHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  return (
    <motion.div
      ref={ref}
      className="absolute inset-0 w-full"
      style={{ y: bgY, height: "120%", top: "-10%" }}
    >
      <img
        src={infraHero}
        alt="Sanap Hi-Tech Nursery Infrastructure"
        className="w-full h-full object-cover object-center"
      />
    </motion.div>
  );
}

export default function Infrastructure() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ height: "clamp(500px, 70vh, 650px)" }}>
        {/* Parallax image */}
        <ParallaxHero />

        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.55) 100%)" }} />

        {/* Content */}
        <div className="container-nursery relative z-10 flex items-center justify-center h-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl w-full text-center"
          >
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold mb-5 text-white border border-white/30"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
            >
              World-Class Facilities
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="font-display text-5xl md:text-7xl font-bold text-white mb-5"
              style={{ textShadow: "0 2px 30px rgba(0,0,0,0.6), 0 1px 6px rgba(0,0,0,0.4)" }}
            >
              Our Infrastructure
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-lg md:text-xl leading-relaxed text-white/90 max-w-xl mx-auto"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
            >
              28+ years of excellence backed by cutting-edge technology and modern facilities
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Infrastructure Cards */}
      <section className="py-20 bg-gradient-to-b from-background via-secondary/30 to-background">
        <div className="container-nursery max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-[0.2em]">Our Facilities</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">World-Class Infrastructure</h2>
          </motion.div>
          <div className="space-y-4">
            {infrastructureItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl overflow-hidden shadow-card border-2 transition-all duration-300 ${
                  openIndex === index
                    ? "border-primary bg-gradient-to-br from-primary/5 via-card to-secondary/20"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                      openIndex === index ? "gradient-cta text-white shadow-md" : "bg-muted text-muted-foreground"
                    }`}>
                      {index + 1}
                    </span>
                    <h3 className={`font-display text-xl md:text-2xl font-bold transition-colors ${
                      openIndex === index ? "text-primary" : "text-foreground"
                    }`}>
                      {item.title}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-primary transition-transform duration-300 shrink-0 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-500 overflow-hidden ${
                    openIndex === index ? "max-h-[2000px]" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-6 space-y-6">
                    <div className="h-px bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />
                    <p className="text-foreground/80 leading-relaxed pl-[52px]">{item.description}</p>
                    <div className="grid grid-cols-3 gap-4">
                      {item.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`${item.title} ${i + 1}`}
                          className="aspect-video bg-muted rounded-xl overflow-hidden object-cover w-full shadow-sm"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-nursery text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Visit Our Facility
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Experience our world-class infrastructure firsthand. Schedule a visit to see how we produce premium grafted seedlings.
          </p>
          <a
            href="/contact"
            className="inline-block bg-accent text-accent-foreground px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            Schedule a Visit
          </a>
        </div>
      </section>
    </div>
  );
}
