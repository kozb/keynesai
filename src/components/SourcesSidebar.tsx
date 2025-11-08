import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SourceCard } from "./SourceCard";
import { ScrollArea } from "@/components/ui/scroll-area";

export const SourcesSidebar = () => {
  const sources = [
    { title: "Introduction to AI", type: "PDF", date: "2 days ago" },
    { title: "Machine Learning Basics", type: "Document", date: "1 week ago" },
    { title: "Neural Networks Overview", type: "PDF", date: "2 weeks ago" },
    { title: "Deep Learning Theory", type: "Document", date: "3 weeks ago" },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-sm text-foreground mb-3">Sources</h2>
        <Button variant="outline" size="sm" className="w-full gap-2">
          <Upload className="h-4 w-4" />
          Add Source
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {sources.map((source, index) => (
            <SourceCard key={index} {...source} />
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t border-border">
        <Button variant="ghost" size="sm" className="w-full gap-2 text-muted-foreground">
          <Plus className="h-4 w-4" />
          Create New
        </Button>
      </div>
    </aside>
  );
};
