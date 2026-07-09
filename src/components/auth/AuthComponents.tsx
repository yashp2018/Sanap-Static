import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

// ── Dark green glass input ────────────────────────────────────
interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
  success?: boolean;
  rightElement?: React.ReactNode;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ icon, error, success, rightElement, className = "", ...props }, ref) => {
    const borderColor = error
      ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/15"
      : success
      ? "border-emerald-500/50 focus:border-emerald-400/70 focus:ring-emerald-500/15"
      : "border-emerald-900/60 focus:border-emerald-500/60 focus:ring-emerald-500/10";

    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600/60 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full py-3 bg-emerald-950/60 border rounded-xl text-sm text-white/85
            placeholder:text-emerald-800/60 transition-all duration-200
            focus:outline-none focus:ring-2 focus:bg-emerald-950/80
            ${icon ? "pl-10" : "pl-4"}
            ${rightElement ? "pr-10" : "pr-4"}
            ${borderColor}
            ${className}
          `}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
        {(error || success) && !rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {error
              ? <AlertCircle className="w-4 h-4 text-red-400" />
              : <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            }
          </div>
        )}
      </div>
    );
  }
);
GlassInput.displayName = "GlassInput";

// ── Password input ────────────────────────────────────────────
interface PasswordInputProps extends Omit<GlassInputProps, "type" | "rightElement"> {}

export function PasswordInput({ ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);
  return (
    <GlassInput
      {...props}
      type={show ? "text" : "password"}
      rightElement={
        <button type="button" onClick={() => setShow(v => !v)}
          className="text-emerald-700/60 hover:text-emerald-400 transition-colors">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
    />
  );
}

// ── Form field ────────────────────────────────────────────────
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-[10px] font-bold text-emerald-600/70 uppercase tracking-widest">
        {label}
        {required && <span className="text-emerald-400">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1 text-xs text-red-400"
          >
            <AlertCircle className="w-3 h-3 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Submit button ─────────────────────────────────────────────
interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
  variant?: "green" | "dark";
}

export function AuthButton({ loading, children, variant = "green", className = "", ...props }: AuthButtonProps) {
  const styles = variant === "green"
    ? "from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-500 hover:via-green-500 hover:to-emerald-600 shadow-emerald-900/60"
    : "from-green-900 via-emerald-900 to-green-950 hover:from-green-800 hover:to-emerald-800 shadow-green-900/40 border border-emerald-800/40";

  return (
    <motion.button
      whileHover={{ scale: loading ? 1 : 1.01 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      className={`
        relative w-full py-3.5 rounded-xl font-bold text-sm text-white
        bg-gradient-to-r ${styles}
        shadow-lg transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        overflow-hidden group
        ${className}
      `}
      {...(props as any)}
    >
      {/* Shimmer sweep */}
      {!loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      )}
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-emerald-300/30 border-t-emerald-200 rounded-full animate-spin" />
            Processing...
          </>
        ) : children}
      </span>
    </motion.button>
  );
}

// ── Divider ───────────────────────────────────────────────────
export function AuthDivider({ text = "or" }: { text?: string }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-emerald-900/50" />
      <span className="text-xs text-emerald-800/60 font-medium">{text}</span>
      <div className="flex-1 h-px bg-emerald-900/50" />
    </div>
  );
}
