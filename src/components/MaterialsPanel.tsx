import { useRef } from "react";
import { Upload, FileText, FileSpreadsheet, File, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp, Material } from "@/contexts/AppContext";

export const MaterialsPanel = () => {
  const { materials, setMaterials } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "Excel":
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
      case "Word":
        return <File className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getFileType = (fileName: string): "PDF" | "Excel" | "Word" => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "PDF";
    if (["xlsx", "xls", "csv"].includes(ext || "")) return "Excel";
    if (["docx", "doc"].includes(ext || "")) return "Word";
    return "PDF"; // default
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const fileType = getFileType(file.name);
      
      // Only accept PDF, Excel, and Word files
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ];
      
      const validExtensions = ["pdf", "xlsx", "xls", "csv", "docx", "doc"];
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      
      if (!validExtensions.includes(fileExt || "") && !validTypes.includes(file.type)) {
        return;
      }

      const newMaterial: Material = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: fileType,
        file,
        uploadedAt: new Date(),
        status: "uploading",
      };

      setMaterials((prev) => {
        const updated = [...prev, newMaterial];
        // Simulate upload completion
        setTimeout(() => {
          setMaterials((current) =>
            current.map((m) =>
              m.id === newMaterial.id ? { ...m, status: "ready" as const } : m
            )
          );
        }, 1000);
        return updated;
      });
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="h-full flex flex-col border-r border-border bg-card">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-sm text-foreground mb-3">Materials</h2>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.xlsx,.xls,.csv,.docx,.doc"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          Upload Files
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          PDF, Excel, Word files
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {materials.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No materials uploaded yet</p>
              <p className="text-xs mt-1">Upload PDF, Excel, or Word files to get started</p>
            </div>
          ) : (
            materials.map((material) => (
              <Card
                key={material.id}
                className="p-3 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-secondary">
                    {getFileIcon(material.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm text-foreground truncate">
                        {material.name}
                      </h4>
                      {material.status === "ready" && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {material.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {material.uploadedAt.toLocaleDateString()}
                      </span>
                    </div>
                    {material.status === "uploading" && (
                      <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary animate-pulse w-1/2"></div>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveMaterial(material.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
