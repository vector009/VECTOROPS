import { cn } from "@/lib/utils";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  );
}
export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-500/80"><tr>{children}</tr></thead>;
}
export function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn("px-4 py-2.5 font-medium", className)}>{children}</th>;
}
export function Tr({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={cn("border-b border-line last:border-0 hover:bg-paper-100/60", className)}>{children}</tr>;
}
export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 text-ink-950", className)}>{children}</td>;
}
