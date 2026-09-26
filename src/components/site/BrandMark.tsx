import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  onPaper = false,
}: {
  className?: string;
  onPaper?: boolean;
}) {
  return (
    <img
      src="/logo.png"
      alt="ROSKYRO"
      width={80}
      height={80}
      className={cn(
        "object-contain",
        onPaper && "rounded-[10px] bg-paper p-0.5",
        className,
      )}
    />
  );
}
