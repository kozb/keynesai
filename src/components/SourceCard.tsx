import { FileText, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SourceCardProps {
  title: string;
  type: string;
  date: string;
}

export const SourceCard = ({ title, type, date }: SourceCardProps) => {
  return (
    <div className="group p-3 rounded-lg border border-border bg-card hover:shadow-md transition-all cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-md bg-secondary">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-foreground truncate">{title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{type} • {date}</p>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
