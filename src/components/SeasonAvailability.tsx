import { Check, Minus } from "lucide-react";

interface SeasonAvailabilityProps {
  availableMonths: number[];
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function SeasonAvailability({ availableMonths }: SeasonAvailabilityProps) {
  return (
    <div className="rounded-xl border border-primary/20 bg-secondary/30 p-3">
      <p className="text-sm font-semibold text-primary mb-2">Season/Availability:</p>
      <div className="rounded-lg overflow-hidden border border-primary/30">
        {/* Month Headers */}
        <div className="grid grid-cols-12">
          {months.map((month) => (
            <div key={month} className="bg-primary text-primary-foreground text-center text-[10px] font-bold py-1.5 border-r border-primary-dark/30 last:border-r-0">
              {month}
            </div>
          ))}
        </div>
        {/* Availability Row */}
        <div className="grid grid-cols-12 bg-white">
          {months.map((_, index) => {
            const available = availableMonths.includes(index);
            return (
              <div key={index} className="flex items-center justify-center py-2 border-r border-border/50 last:border-r-0">
                {available
                  ? <Check className="w-3.5 h-3.5 text-primary font-bold" strokeWidth={3} />
                  : <Minus className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
                }
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
