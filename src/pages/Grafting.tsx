import { motion } from "framer-motion";
import { Sprout, Shield, TrendingUp, Droplet, CheckCircle, ArrowRight, Leaf, Dna } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  { icon: Shield, title: "Disease Protection", desc: "Protects plants from soil-borne diseases" },
  { icon: Sprout, title: "Stronger Plants", desc: "Improves plant strength and root system" },
  { icon: TrendingUp, title: "Higher Yield", desc: "Increases crop yield and uniform production" },
  { icon: Droplet, title: "Stress Tolerance", desc: "Survives heat, salinity, and weak soil conditions" },
];

const graftingSteps = [
  { step: 1, title: "Selection", desc: "Choose disease-resistant rootstock and high-yielding scion variety" },
  { step: 2, title: "Preparation", desc: "Cut both plants at precise angles using sterilized tools" },
  { step: 3, title: "Joining", desc: "Carefully join the scion and rootstock ensuring tissue contact" },
  { step: 4, title: "Securing", desc: "Use grafting clips or tape to hold the union firmly" },
  { step: 5, title: "Healing", desc: "Maintain optimal humidity and temperature for 7-10 days" },
  { step: 6, title: "Hardening", desc: "Gradually expose to normal conditions before transplanting" },
];

export default function Grafting() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20 md:py-32">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block bg-green-900 text-green-100 border border-green-700 px-6 py-2 rounded-full font-semibold text-sm mb-6"
            >
              Advanced Agriculture Technology
            </motion.span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              What is Grafting?
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed">
              An advanced plant propagation technique that combines the best qualities of two plants into one stronger, more productive unit.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 surface-warm">
        <div className="container-nursery max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
              Understanding Grafting
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Grafting is the process of joining two different plants so they grow together as one healthy plant. This technique has been practiced for many years in fruit crops and is now widely used in vegetable cultivation.
              </p>
              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-card p-6 rounded-2xl border border-border">
                  <div className="w-10 h-10 rounded-xl gradient-cta flex items-center justify-center mb-3">
                    <Leaf className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-primary mb-3">Scion</h3>
                  <p className="text-sm">The upper portion of the plant which produces fruits and determines the variety characteristics.</p>
                </div>
                <div className="bg-card p-6 rounded-2xl border border-border">
                  <div className="w-10 h-10 rounded-xl gradient-cta flex items-center justify-center mb-3">
                    <Sprout className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-primary mb-3">Rootstock</h3>
                  <p className="text-sm">The lower portion with roots that absorbs water and nutrients, providing strength and disease resistance.</p>
                </div>
              </div>
              <p>
                The scion and rootstock are carefully joined so that their tissues fuse and grow as a single plant. This is a <strong>natural method — no genetic modification is involved.</strong>
              </p>
              <p>
                Instead of changing the fruit variety, grafting improves the plant from below (root level), combining strength and resistance with quality fruits and higher yield.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vegetable Grafting */}
      <section className="py-20">
        <div className="container-nursery max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              What is Vegetable Grafting?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Vegetable grafting is the use of this technique specially for vegetable crops like <strong>tomato, brinjal, watermelon, cucumber, capsicum,</strong> and more. A disease-resistant and strong root plant is combined with a high-yielding vegetable variety to produce vegetables that are stronger, more productive, and long-lasting.
            </p>
          </motion.div>
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
              Why is Grafting Important?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Grafting provides multiple benefits that help farmers achieve better results and sustainable farming practices.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 shadow-card hover-lift"
              >
                <div className="w-12 h-12 rounded-xl gradient-cta flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 shadow-elevated"
          >
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">Additional Benefits:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Reduces crop loss and increases farmer income",
                "Supports modern and sustainable farming practices",
                "Enables cultivation in problematic soils",
                "Increases plant vigor and uniform growth",
                "Extends harvest period and shelf life",
                "Reduces need for chemical treatments"
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grafting Process */}
      <section className="py-20">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              The Grafting Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our expert team follows a precise 6-step process to ensure 98%+ success rate in grafted seedlings.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {graftingSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative flex gap-6 mb-8 last:mb-0"
              >
                {/* Connector Line */}
                {i < graftingSteps.length - 1 && (
                  <div className="absolute left-8 top-16 w-0.5 h-full bg-border" />
                )}
                
                {/* Step Number */}
                <div className="relative flex-shrink-0 w-16 h-16 rounded-full gradient-cta flex items-center justify-center shadow-elevated">
                  <span className="font-display text-2xl font-bold text-primary-foreground">{step.step}</span>
                </div>

                {/* Content */}
                <div className="flex-1 bg-card rounded-2xl p-6 shadow-card hover-lift">
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
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
              Experience the Power of Grafted Seedlings
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              In simple words, grafting means giving a plant strong roots and a productive top to get better results.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 gradient-gold text-accent-foreground px-8 py-4 rounded-full font-bold text-lg hover:shadow-gold transition-all hover:scale-105"
            >
              Browse Our Grafted Seedlings <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
