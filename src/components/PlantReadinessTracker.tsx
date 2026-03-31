import { useMemo } from "react";
import { CalendarCheck, Truck, Sprout } from "lucide-react";

interface Props {
  durationDays: number;
  cropName: string;
}

export default function PlantReadinessTracker({ durationDays, cropName }: Props) {
  const { orderBy, readyOn, dispatchOn, daysFromNow } = useMemo(() => {
    const today = new Date();
    const ready = new Date(today);
    ready.setDate(today.getDate() + durationDays);
    const dispatch = new Date(ready);
    dispatch.setDate(ready.getDate() + 2); // 2 days packing + dispatch

    const fmt = (d: Date) =>
      d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

    // "Order by" = today for next batch
    return {
      orderBy:     fmt(today),
      readyOn:     fmt(ready),
      dispatchOn:  fmt(dispatch),
      daysFromNow: durationDays,
    };
  }, [durationDays]);

  const steps = [
    { icon: CalendarCheck, label: "Order Today",      date: orderBy,    done: true },
    { icon: Sprout,        label: "Plants Ready",     date: readyOn,    done: false },
    { icon: Truck,         label: "Estimated Dispatch", date: dispatchOn, done: false },
  ];

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-card">
      <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <CalendarCheck className="w-4 h-4 text-primary" />
        Plant Readiness Tracker
      </p>

      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
        <div className="absolute top-5 left-5 h-0.5 bg-primary transition-all" style={{ width: "16%" }} />

        <div className="relative flex justify-between">
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center gap-2 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 transition-all ${
                step.done
                  ? "gradient-cta border-primary text-primary-foreground"
                  : "bg-card border-border text-muted-foreground"
              }`}>
                <step.icon className="w-4 h-4" />
              </div>
              <div className="text-center">
                <p className={`text-xs font-semibold ${step.done ? "text-primary" : "text-foreground"}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          Order now → receive your <span className="font-semibold text-foreground">{cropName}</span> seedlings in
          <span className="font-bold text-primary"> ~{daysFromNow + 2} days</span>
        </p>
      </div>
    </div>
  );
}
