import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-9 w-full rounded-md border border-line bg-white px-3 text-sm placeholder:text-ink-500/60 focus:border-signal-DEFAULT",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
