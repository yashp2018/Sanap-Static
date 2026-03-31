import { motion } from "framer-motion";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Camera, Tag } from "lucide-react";

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

const galleryImages = [
  { src: customerVisit, category: "Customer Visit", title: "Customer Farm Visit", desc: "Meeting with our valued customers" },
  { src: img1, category: "Nursery", title: "Our Nursery", desc: "State-of-the-art growing facility" },
  { src: img2, category: "Nursery", title: "Seedling Production", desc: "Premium quality seedling cultivation" },
  { src: img3, category: "Nursery", title: "Quality Plants", desc: "Healthy and robust seedlings" },
  { src: img4, category: "Seminar", title: "Farmer Training", desc: "Educational workshop for farmers" },
  { src: img5, category: "Seminar", title: "Knowledge Sharing", desc: "Expert guidance and training" },
  { src: img6, category: "Nursery", title: "Grafting Process", desc: "Advanced Japanese grafting technique" },
  { src: img7, category: "Nursery", title: "Plant Care", desc: "Careful nurturing of seedlings" },
  { src: img8, category: "Customer Visit", title: "Happy Customers", desc: "Satisfied farmers with quality plants" },
  { src: img9, category: "Nursery", title: "Growing Facility", desc: "Modern greenhouse infrastructure" },
  { src: img10, category: "Seminar", title: "Agricultural Workshop", desc: "Training on modern farming techniques" },
  { src: img11, category: "Nursery", title: "Healthy Seedlings", desc: "Ready for transplantation" },
];

const categories = ["All", "Nursery", "Customer Visit", "Seminar"];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const filteredImages = selectedCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImage((currentImage + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImage(currentImage > 0 ? currentImage - 1 : filteredImages.length - 1);
  };

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
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-accent/20 text-accent border border-accent/30 rounded-full px-6 py-2 text-sm font-semibold mb-6"
            >
              <Camera className="w-4 h-4" /> Our Journey in Pictures
            </motion.div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Gallery
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed">
              Explore our nursery, customer visits, and farmer training seminars through our photo collection
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 surface-warm">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105 ${
                  selectedCategory === cat
                    ? "gradient-cta text-primary-foreground shadow-elevated"
                    : "bg-card text-foreground border border-border hover:border-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 pb-20">
        <div className="container-nursery">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all cursor-pointer hover-lift"
                onClick={() => openLightbox(i)}
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform">
                    <span className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full mb-2">
                      <Tag className="w-3 h-3" /> {img.category}
                    </span>
                    <h3 className="font-display text-xl font-bold text-primary-foreground mb-1">
                      {img.title}
                    </h3>
                    <p className="text-sm text-primary-foreground/80">
                      {img.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <motion.img
              key={currentImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={filteredImages[currentImage].src}
              alt={filteredImages[currentImage].title}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
            <div className="text-center mt-6">
              <span className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full mb-2">
                <Tag className="w-3 h-3" /> {filteredImages[currentImage].category}
              </span>
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                {filteredImages[currentImage].title}
              </h3>
              <p className="text-white/80">
                {filteredImages[currentImage].desc}
              </p>
              <p className="text-white/60 text-sm mt-2">
                {currentImage + 1} / {filteredImages.length}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
