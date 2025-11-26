import { cn } from "@/lib/utils";

const variants = {
  default: "bg-slate-700 text-white border-transparent",
  outline: "border border-gray-600 text-gray-200",
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}