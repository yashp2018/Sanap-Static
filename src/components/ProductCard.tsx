import { Link } from "react-router-dom";
import { ShoppingCart, Clock, Building2, PackageCheck, PackageX } from "lucide-react";
import { Variety } from "@/data/products";
import SeasonAvailability from "@/components/SeasonAvailability";
import { useLanguage } from "@/context/LanguageContext";

interface ProductCardProps {
  variety: Variety;
}

export default function ProductCard({ variety }: ProductCardProps) {
  const { t } = useLanguage();

  const cropNameMap: Record<string, string> = {
    tomato: t("cropTomato"), chili: t("cropChili"), brinjal: t("cropBrinjal"),
    capsicum: t("cropCapsicum"), cucumber: t("cropCucumber"), cabbage: t("cropCabbage"),
    cauliflower: t("cropCauliflower"), bittergourd: t("cropBitterGourd"),
    bottlegourd: t("cropBottleGourd"), watermelon: t("cropWatermelon"),
    muskmelon: t("cropMuskmelon"), papaya: t("cropPapaya"),
    marigold: t("cropMarigold"), sugarcane: t("cropSugarcane"), drumstick: t("cropDrumstick"),
  };

  const translatedCropName = cropNameMap[variety.cropId] || variety.cropName;
  return (
    <Link
      to={`/product/${variety.slug || variety.id}`}
      className="product-card block bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all hover:-translate-y-1 group border border-border/50"
      data-variety-id={variety.slug || variety.id}
      id={`product-card-${variety.slug || variety.id}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={variety.image}
          alt={`${variety.name} ${variety.cropName} seedlings`}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Crop badge — top left */}
        <span className="absolute top-3 left-3 text-xs font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-full shadow-card">
          {translatedCropName}
        </span>
        {/* Stock badge — top right */}
        <span className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 ${
          variety.stock > 0
            ? "bg-white/90 text-primary border border-primary/20"
            : "bg-destructive text-destructive-foreground"
        }`}>
          {variety.stock > 0
            ? <><PackageCheck className="w-3 h-3" /> {t("inStock")}</>
            : <><PackageX className="w-3 h-3" /> {t("outOfStock")}</>}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Company + Duration */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Building2 className="w-3 h-3 shrink-0" />
          <span className="font-medium">{variety.company}</span>
          <span className="text-border">•</span>
          <Clock className="w-3 h-3 shrink-0" />
          <span>{variety.durationDays} days</span>
        </div>

        {/* Variety Name */}
        <h3 className="font-display text-lg font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors leading-tight">
          {variety.name}
        </h3>

        {/* Min Order */}
        <p className="text-xs text-muted-foreground mb-3">
          {t("minOrder")}: {variety.minOrderQty.toLocaleString()} {t("plants")}
        </p>

        {/* Season Availability — always shown, fallback to all months if not set */}
        <div className="mb-4">
          <SeasonAvailability
            availableMonths={variety.availableMonths && variety.availableMonths.length > 0
              ? variety.availableMonths
              : [0,1,2,3,4,5,6,7,8,9,10,11]
            }
            compact
          />
        </div>

        {/* Price */}
        <div className="flex items-end justify-between border-t border-border/50 pt-3">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
              {t("fromRate")}
            </p>
            <p className="text-2xl font-bold text-primary font-sans leading-none">
              ₹{Number(variety.price15k).toFixed(1)}
              <span className="text-xs font-normal text-muted-foreground">/plant</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            <ShoppingCart className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
