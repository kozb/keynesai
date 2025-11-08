import { TrendingUp } from "lucide-react";

export const Header = () => {
  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold text-foreground">KeynesAI</h1>
      </div>
    </header>
  );
};
