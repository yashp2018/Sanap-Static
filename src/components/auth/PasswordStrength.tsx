import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface Req { label: string; met: boolean; }

function getReqs(p: string): Req[] {
  return [
    { label: "At least 8 characters",  met: p.length >= 8 },
    { label: "One uppercase letter",    met: /[A-Z]/.test(p) },
    { label: "One lowercase letter",    met: /[a-z]/.test(p) },
    { label: "One number",              met: /\d/.test(p) },
    { label: "One special character",   met: /[^A-Za-z0-9]/.test(p) },
  ];
}

function getStrength(reqs: Req[]) {
  const n = reqs.filter(r => r.met).length;
  if (n <= 1) return { score: n, label: "Very Weak", color: "text-red-400",     bar: "bg-red-500"     };
  if (n === 2) return { score: n, label: "Weak",      color: "text-orange-400",  bar: "bg-orange-500"  };
  if (n === 3) return { score: n, label: "Fair",      color: "text-amber-400",   bar: "bg-amber-500"   };
  if (n === 4) return { score: n, label: "Strong",    color: "text-emerald-400", bar: "bg-emerald-500" };
  return              { score: n, label: "Very Strong",color: "text-green-300",  bar: "bg-green-400"   };
}

export default function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const reqs     = getReqs(password);
  const strength = getStrength(reqs);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 space-y-2 overflow-hidden"
    >
      {/* Bars */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex-1 h-1 rounded-full bg-emerald-950/80 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: i <= strength.score ? "100%" : "0%" }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`h-full rounded-full ${strength.bar}`}
              />
            </div>
          ))}
        </div>
        <span className={`text-[10px] font-bold whitespace-nowrap ${strength.color}`}>
          {strength.label}
        </span>
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-1">
        {reqs.map((req, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }} className="flex items-center gap-1.5">
            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-colors ${req.met ? "bg-emerald-500/20" : "bg-emerald-950/60"}`}>
              {req.met
                ? <Check className="w-2 h-2 text-emerald-400" />
                : <X className="w-2 h-2 text-emerald-900/60" />
              }
            </div>
            <span className={`text-[10px] transition-colors ${req.met ? "text-emerald-400/70" : "text-emerald-900/50"}`}>
              {req.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
