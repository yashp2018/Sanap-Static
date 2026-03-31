const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface Props {
  availableMonths: number[];
  compact?: boolean;
}

export default function SeasonAvailability({ availableMonths, compact = false }: Props) {
  return (
    <div>
      <p className={`font-semibold text-foreground mb-2 flex items-center gap-1.5 ${compact ? "text-xs" : "text-sm"}`}>
        📅 Season Availability
      </p>
      <div className="flex items-end gap-1">
        {MONTHS.map((m, i) => {
          const on = availableMonths.includes(i);
          return (
            <div key={m} className="flex flex-col items-center gap-1 flex-1">
              <div
                title={`${m}: ${on ? "Available" : "Not available"}`}
                className={`rounded-full transition-all ${
                  compact ? "w-5 h-5" : "w-6 h-6"
                } ${on ? "bg-primary shadow-sm" : "bg-muted"}`}
              />
              <span className={`font-medium leading-none ${
                compact ? "text-[8px]" : "text-[9px]"
              } ${on ? "text-primary" : "text-muted-foreground"}`}>
                {m}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-2">
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> Available
        </span>
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-muted border border-border inline-block" /> Not Available
        </span>
      </div>
    </div>
  );
}
