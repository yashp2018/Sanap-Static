import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Droplet, Thermometer, Sun } from "lucide-react";
import processImage from "@/assets/img/Process.png";

const processSteps = [
  { step: 1, title: "Preparation of Seedlings", desc: "Healthy rootstock and scion seedlings are carefully prepared for the grafting process." },
  { step: 2, title: "Selection of Plants", desc: "Rootstock and scion plants with similar stem diameters (approximately 1.5–2.5 mm) are selected to ensure proper alignment and bonding." },
  { step: 3, title: "Cutting the Rootstock", desc: "A clean and sharp slant cut is made on the rootstock stem for smooth joining." },
  { step: 4, title: "Placement of Grafting Clip", desc: "A silicon grafting clip or tube is gently placed on the cut rootstock." },
  { step: 5, title: "Cutting the Scion", desc: "The scion stem is cut at the same angle as the rootstock to ensure a perfect match." },
  { step: 6, title: "Joining the Scion and Rootstock", desc: "The scion is inserted into the silicon tube and aligned accurately with the rootstock." },
  { 
    step: 7, 
    title: "Healing Process (Day 1)", 
    desc: "Grafted plants are placed inside moisture-controlled healing tunnels covered with muslin cloth.",
    details: [
      { icon: Droplet, label: "Humidity: ~85%" },
      { icon: Thermometer, label: "Temperature: 25–30°C" },
      { icon: Sun, label: "Light: 3000–4000 Lux" }
    ]
  },
  { step: 8, title: "Controlled Ventilation (Day 4)", desc: "During cooler evening hours, a portion of the cloth covering the healing tunnels is rolled up to allow gradual air circulation." },
  { step: 9, title: "Hardening Stage (Day 7)", desc: "Grafted plants are shifted to a polyhouse for hardening and acclimatization to external conditions." },
  { step: 10, title: "Final Maintenance (Day 10)", desc: "Grafting clips are removed, axillary buds from the rootstock are eliminated, and any gaps are properly filled." },
  { step: 11, title: "Ready for Dispatch (Day 15)", desc: "Fully healed and hardened grafted plants are inspected and prepared for dispatch." },
];

export default function Process() {
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
              className="inline-block bg-green-900 text-green-100 border border-green-700 rounded-full px-6 py-2 text-sm font-semibold mb-6"
            >
              Our Methodology
            </motion.span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Grafting Process
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed">
              A detailed 11-step process ensuring 98%+ success rate in grafted seedlings
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Diagram */}
      <section className="py-12 surface-warm">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <img 
              src={processImage} 
              alt="Grafting Process Diagram" 
              className="w-full rounded-3xl shadow-elevated"
            />
          </motion.div>
        </div>
      </section>

      {/* Detailed Steps */}
      <section className="py-20">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Step-by-Step Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From preparation to dispatch, every step is carefully monitored to ensure premium quality grafted seedlings
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-6">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 md:p-8 shadow-card hover:shadow-elevated transition-all border border-border hover-lift"
              >
                <div className="flex items-start gap-6">
                  {/* Step Number */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-full gradient-cta flex items-center justify-center shadow-lg">
                    <span className="font-display text-2xl font-bold text-primary-foreground">
                      {step.step < 10 ? `0${step.step}` : step.step}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {step.desc}
                    </p>

                    {/* Additional Details */}
                    {step.details && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                        {step.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-secondary/20 rounded-lg p-3">
                            <detail.icon className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-sm font-medium text-foreground">{detail.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Check Icon */}
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Summary */}
      <section className="py-20 surface-green">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Process Timeline
            </h2>
            <p className="text-lg text-muted-foreground">
              From grafting to dispatch in just 15 days
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-4 gap-6">
            {[
              { day: "Day 1", title: "Grafting & Healing", desc: "Initial grafting and placement in healing tunnels" },
              { day: "Day 4", title: "Ventilation", desc: "Controlled air circulation begins" },
              { day: "Day 7", title: "Hardening", desc: "Transfer to polyhouse for acclimatization" },
              { day: "Day 15", title: "Ready", desc: "Quality check and dispatch preparation" },
            ].map((phase, i) => (
              <motion.div
                key={phase.day}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 text-center shadow-card hover-lift"
              >
                <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center mx-auto mb-4">
                  {i + 1}
                </div>
                <h3 className="font-display text-lg font-bold text-primary mb-2">{phase.day}</h3>
                <h4 className="font-semibold text-foreground mb-2">{phase.title}</h4>
                <p className="text-sm text-muted-foreground">{phase.desc}</p>
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
              Experience Our Quality Process
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Every seedling undergoes this rigorous process to ensure you receive the highest quality grafted plants
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 gradient-gold text-accent-foreground px-8 py-4 rounded-full font-bold text-lg hover:shadow-gold transition-all hover:scale-105"
            >
              Order Premium Seedlings <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
