import { useState } from "react";
import { motion } from "framer-motion";
import { Play, X, Sprout } from "lucide-react";

const videos = [
  {
    id: "dQw4w9WgXcQ", // placeholder — replace with real YouTube IDs
    title: "Rajesh Patil — Tomato Farmer",
    location: "Nashik, Maharashtra",
    crop: "Tomato",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    quote: "My yield increased by 40% using Sanap grafted tomato seedlings.",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Suresh Kumar — Chili Farmer",
    location: "Belgaum, Karnataka",
    crop: "Chili",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    quote: "30,000 plants delivered on time, perfect condition. Best nursery.",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Vinod Sharma — Capsicum Farmer",
    location: "Satara, Maharashtra",
    crop: "Capsicum",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    quote: "Grafted plants resist wilt disease — saved my entire crop last season.",
  },
];

export default function FarmerTestimonialVideos() {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <section className="py-20 surface-warm">
      <div className="container-nursery">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-[0.2em] font-sans">Real Stories</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Farmers Speak
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Watch real farmers share their experience with Sanap Hi-Tech Nursery seedlings
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((v, i) => (
            <motion.div
              key={`${v.id}-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 hover:shadow-elevated transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-muted overflow-hidden">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { (e.target as HTMLImageElement).src = "/SA.png"; }}
                />
                <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
                  <button
                    onClick={() => setPlaying(v.id + i)}
                    className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-elevated hover:scale-110 transition-transform"
                  >
                    <Play className="w-6 h-6 text-primary fill-primary ml-1" />
                  </button>
                </div>
                <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Sprout className="w-3 h-3" /> {v.crop}
                </span>
              </div>

              {/* Info */}
              <div className="p-5">
                <p className="text-sm text-foreground/80 italic mb-3">"{v.quote}"</p>
                <p className="font-display font-bold text-foreground text-sm">{v.title}</p>
                <p className="text-xs text-muted-foreground">{v.location}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Modal */}
        {playing && (
          <div
            className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPlaying(null)}
          >
            <div className="relative w-full max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden shadow-elevated">
              <button
                onClick={() => setPlaying(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${playing.replace(/\d+$/, "")}?autoplay=1`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
