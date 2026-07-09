import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import whatsappIcon from "@/assets/WhatsApp.svg.webp";

export default function FloatingButtons() {
  const [showScroll, setShowScroll] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setShowScroll(window.scrollY > 400);
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress(height > 0 ? (winScroll / height) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Scroll Progress */}
      <div className="scroll-progress" style={{ width: `${progress}%` }} />

      {/* WhatsApp */}
      <a
        href="https://wa.me/917447770803?text=Hi%2C%20I%20want%20to%20enquire%20about%20plants"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-elevated hover:scale-110 transition-transform"
        aria-label="Chat on WhatsApp"
      >
        <img src={whatsappIcon} alt="WhatsApp" className="w-14 h-14" />
      </a>

      {/* Scroll to Top */}
      {showScroll && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full gradient-cta text-primary-foreground flex items-center justify-center shadow-elevated hover:scale-110 transition-transform animate-fade-up"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
}
