import { motion } from "framer-motion";
import { Award, Users, Leaf, MapPin, Eye, Target, Gem } from "lucide-react";
import avinashImage from "@/assets/team/avinash-sanap.jpg";
import sheetalImage from "@/assets/team/sheetal-sanap.jpeg";
import ashutoshImage from "@/assets/team/ashutosh-sanap.jpg";
import omImage from "@/assets/team/om-sanap.jpg";

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container-nursery">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">About Sanap Hi-Tech Nursery</h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl">
              28+ years of pioneering vegetable grafting technology and delivering premium seedlings to farmers across India.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-nursery">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-foreground mb-6 text-center">Our Story</h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>Founded in 1998, Sanap Hi-Tech Nursery (I) Pvt. Ltd. has been at the forefront of agricultural innovation in Maharashtra. Starting from humble beginnings in Narayangaon, we have grown to become one of India's most trusted names in grafted vegetable seedlings.</p>
              <p>Our state-of-the-art grafting facility produces over 10 lakh plants annually, serving 5,000+ farmers across 15+ states. We specialize in disease-resistant, high-yielding varieties of tomato, chili, brinjal, capsicum, and watermelon using world-class Japanese grafting technology.</p>
              <p className="font-semibold text-primary text-lg text-center mt-6">"Trust of Farmers – Generation to Generation"</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-20 surface-warm">
        <div className="container-nursery">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-[0.2em]">Leadership</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">Meet Our Team</h2>
          </motion.div>

          <div className="space-y-16">
            {/* Avinash Sanap */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-3xl shadow-elevated overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 md:p-10">
                <div className="flex flex-col items-center text-center">
                  <img src={avinashImage} alt="Avinash Sanap" className="w-64 h-64 rounded-2xl object-cover shadow-xl mb-4 ring-4 ring-primary/10" />
                  <h3 className="font-display text-2xl font-bold text-foreground">Avinash Sanap</h3>
                  <p className="text-sm text-primary font-semibold mt-1">Managing Director</p>
                </div>
                <div className="lg:col-span-2 space-y-4 text-foreground/80 leading-relaxed">
                  <p>Mr. Avinash Sanap, the Managing Director of Sanap Hi-Tech Nursery (I) Pvt. Ltd., is deeply involved in overseeing the day-to-day operations of the nursery. He firmly believes in customer-centric service, reliability, and providing farmers with the right guidance tailored to their needs.</p>
                  <p>Having worked closely at the grassroots level in agriculture, Mr. Sanap has a genuine understanding of the struggles, hardships, and aspirations of farmers. His down-to-earth approach allows him to connect effortlessly with farmers, fostering trust and open communication.</p>
                  <p>Known for his humility and inclusive leadership, he always ensures collective growth by taking everyone along. As the head of his family and company, he has successfully nurtured Sanap Hi-Tech Nursery into a strong institution, united by a bond of trust.</p>
                  <p className="text-primary font-semibold italic">"The greatest honor lies in the love, trust, and loyalty of the farming community."</p>
                </div>
              </div>
            </motion.div>

            {/* Shital Sanap */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-3xl shadow-elevated overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 md:p-10">
                <div className="flex flex-col items-center text-center lg:order-last">
                  <img src={sheetalImage} alt="Sheetal Avinash Sanap" className="w-64 h-64 rounded-2xl object-cover shadow-xl mb-4 ring-4 ring-accent/10" />
                  <h3 className="font-display text-2xl font-bold text-foreground">Shital Avinash Sanap</h3>
                  <p className="text-sm text-primary font-semibold mt-1">Director</p>
                </div>
                <div className="lg:col-span-2 space-y-4 text-foreground/80 leading-relaxed">
                  <p>Mrs. Shital Avinash Sanap, Director of Sanap Hi-Tech Nursery (I) Pvt. Ltd., was born into a farming family. From her early childhood, she developed a deep passion for agriculture. After marriage, being part of an agriculturally rooted family, she continued to be closely exposed to farming discussions and the everyday struggles of farmers.</p>
                  <p>She realized that although women contribute immensely to agriculture, their efforts often go unrecognized in society. Recognizing the resilience of women in farming, Mrs. Sanap has consistently worked to raise awareness about their contribution.</p>
                  <p>In the daily operations of the nursery, she interacts with women workers with empathy and understanding, ensuring a supportive environment. Her humility, compassion, and sincerity have helped her build strong, heartfelt connections with women farmers.</p>
                  <p className="text-primary font-semibold italic">"The labor of women farmers is not just the strength of their families, but a true asset to society. Their work deserves rightful recognition and respect."</p>
                </div>
              </div>
            </motion.div>

            {/* Ashutosh Sanap */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-3xl shadow-elevated overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 md:p-10">
                <div className="flex flex-col items-center text-center">
                  <img src={ashutoshImage} alt="Ashutosh Avinash Sanap" className="w-64 h-64 rounded-2xl object-cover shadow-xl mb-4 ring-4 ring-primary/10" />
                  <h3 className="font-display text-2xl font-bold text-foreground">Ashutosh Avinash Sanap</h3>
                  <p className="text-sm text-primary font-semibold mt-1">Executive Director</p>
                </div>
                <div className="lg:col-span-2 space-y-4 text-foreground/80 leading-relaxed">
                  <p>Mr. Ashutosh Avinash Sanap is the dynamic and visionary Executive Director of Sanap Hi-Tech Nursery (I) Pvt. Ltd. A graduate in Commerce and currently pursuing higher studies in Business Management, he brings a unique blend of humility, determination, and forward-thinking leadership.</p>
                  <p>Acknowledging that despite being one of the oldest nurseries in Nashik district, the expected growth was not achieved, Mr. Sanap has taken a firm resolve – to transform Sanap Hi-Tech Nursery into one of the leading nurseries in India within the coming decade.</p>
                  <p>He deeply studies the challenges of agriculture, climate change impact, market fluctuations, emerging technologies, and evolving customer expectations. His management approach reflects this through a strong focus on consistent plant quality, robust supply chain, advanced technology adoption, and creating a skilled leadership team.</p>
                  <p className="text-primary font-semibold italic">"Sanap Hi-Tech Nursery should not remain merely a business, but should grow into a trusted and respected brand in the hearts of farmers."</p>
                </div>
              </div>
            </motion.div>

            {/* Om Sanap */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-3xl shadow-elevated overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 md:p-10">
                <div className="flex flex-col items-center text-center lg:order-last">
                  <img src={omImage} alt="Om Avinash Sanap" className="w-64 h-64 rounded-2xl object-cover shadow-xl mb-4 ring-4 ring-accent/10" />
                  <h3 className="font-display text-2xl font-bold text-foreground">Om Avinash Sanap</h3>
                  <p className="text-sm text-primary font-semibold mt-1">Director</p>
                </div>
                <div className="lg:col-span-2 space-y-4 text-foreground/80 leading-relaxed">
                  <p>As the third-generation leader of Sanap Hi-Tech Nursery (I) Pvt. Ltd., Om Avinash Sanap has carried forward a deep-rooted passion for innovation, discipline, and positivity since his childhood. A BBA graduate, this young director envisions a bold dream – to scale Sanap Nursery to a turnover of ₹100 crore and establish it as a brand recognized on the international stage.</p>
                  <p>For Om, the nursery is not just a business but a mission to build a new culture of management. He strongly believes that beyond having a dress code, the company must nurture a strong organizational culture, foster open communication with employees, and adopt automation in production processes.</p>
                  <p>With a strong desire to learn from countries like Israel, China, and other agricultural leaders, he is committed to bringing world-class practices into Sanap Nursery. From mastering production details to exploring global technologies, Om approaches every challenge with curiosity and determination.</p>
                  <p className="text-primary font-semibold italic">"Sanap Nursery should grow into a symbol of farmers' trust and a modern identity of excellence, carrying forward the legacy of two generations."</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== VISION, MISSION & CORE VALUES ===== */}
      <section className="py-20 bg-gradient-to-br from-secondary via-background to-secondary/40">
        <div className="container-nursery">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-[0.2em]">Our Foundation</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">Vision, Mission & Core Values</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-card rounded-2xl border border-primary/20 overflow-hidden shadow-card hover-lift"
            >
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80" alt="Vision" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">Vision</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  To become India's leading nursery by producing strong, disease-resistant vegetable, fruit, and flower seedlings for sustainable farming — empowering farmers through modern technology, research, and a business-driven approach to make them capable, trained, and self-reliant.
                </p>
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-primary/20 overflow-hidden shadow-card hover-lift"
            >
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&q=80" alt="Mission" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">Mission</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  To positively impact the lives of at least 1,00,000 farmers by 2030 — by providing timely and reliable supply of strong seedlings; empowering them through modern technology, agricultural research, and guidance to become decision-makers and self-reliant.
                </p>
              </div>
            </motion.div>

            {/* Core Values Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-primary/20 overflow-hidden shadow-card hover-lift"
            >
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80" alt="Core Values" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Gem className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">Core Values</h3>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><span className="font-semibold text-foreground">1. Trustworthiness —</span> Every plant is a symbol of honest service and farmer trust.</p>
                  <p><span className="font-semibold text-foreground">2. Consistent Quality —</span> Excellence and consistency in every plant we produce.</p>
                  <p><span className="font-semibold text-foreground">3. Integrity & Transparency —</span> Honest, clean, and fair dealings with all farmers.</p>
                  <p><span className="font-semibold text-foreground">4. Human-Centric Relations —</span> Humanity first — we think of everyone's benefit.</p>
                  <p><span className="font-semibold text-foreground">5. Community Growth —</span> We don't grow alone — we grow together with everyone.</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <section className="py-16 surface-warm">
        <div className="container-nursery text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-10">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: "28+ Years", desc: "Trusted by generations of farmers" },
              { icon: Leaf, title: "Grafted Plants", desc: "World-class grafting technology" },
              { icon: Users, title: "5000+ Farmers", desc: "Happy customers across India" },
              { icon: MapPin, title: "Pan-India Delivery", desc: "Reliable shipping nationwide" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-8 shadow-card"
              >
                <item.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
