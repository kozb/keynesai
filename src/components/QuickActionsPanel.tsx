import { useState } from "react";
import { Sparkles, TrendingUp, PieChart, BarChart3, Calculator, FileSearch, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/contexts/AppContext";

interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const quickActions: QuickAction[] = [
  {
    id: "financial-summary",
    name: "Financial Summary",
    description: "Generate a comprehensive financial summary from documents",
    icon: <FileSearch className="h-4 w-4" />,
  },
  {
    id: "revenue-analysis",
    name: "Revenue Analysis",
    description: "Analyze revenue trends and patterns",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    id: "expense-breakdown",
    name: "Expense Breakdown",
    description: "Break down expenses by category",
    icon: <PieChart className="h-4 w-4" />,
  },
  {
    id: "profit-margin",
    name: "Profit Margin Analysis",
    description: "Calculate and analyze profit margins",
    icon: <Calculator className="h-4 w-4" />,
  },
  {
    id: "comparative-analysis",
    name: "Comparative Analysis",
    description: "Compare financial metrics across periods",
    icon: <BarChart3 className="h-4 w-4" />,
  },
];

export const QuickActionsPanel = () => {
  const { materials, analysisResults, addAnalysisResult } = useApp();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Only show ready materials
  const readyMaterials = materials.filter((m) => m.status === "ready");

  const handleMaterialToggle = (materialId: string) => {
    setSelectedMaterials((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(materialId)) {
        newSet.delete(materialId);
      } else {
        newSet.add(materialId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedMaterials.size === readyMaterials.length) {
      setSelectedMaterials(new Set());
    } else {
      setSelectedMaterials(new Set(readyMaterials.map((m) => m.id)));
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedAction || selectedMaterials.size === 0) return;

    setIsAnalyzing(true);

    // Simulate analysis
    setTimeout(() => {
      const result = {
        action: quickActions.find((a) => a.id === selectedAction)?.name,
        materials: readyMaterials.filter((m) => selectedMaterials.has(m.id)).map((m) => m.name),
        data: generateMockResult(selectedAction),
        timestamp: new Date(),
      };

      addAnalysisResult(selectedAction, result);
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateMockResult = (actionId: string) => {
    switch (actionId) {
      case "financial-summary":
        return {
          totalRevenue: "$1,250,000",
          totalExpenses: "$850,000",
          netProfit: "$400,000",
          profitMargin: "32%",
          summary: "The financial analysis shows strong performance with a healthy profit margin. Revenue has been steady, and expenses are well-controlled.",
        };
      case "revenue-analysis":
        return {
          currentPeriod: "$1,250,000",
          previousPeriod: "$1,100,000",
          growth: "+13.6%",
          trend: "increasing",
          breakdown: [
            { category: "Product Sales", amount: "$800,000", percentage: "64%" },
            { category: "Services", amount: "$350,000", percentage: "28%" },
            { category: "Other", amount: "$100,000", percentage: "8%" },
          ],
        };
      case "expense-breakdown":
        return {
          total: "$850,000",
          categories: [
            { name: "Operating Expenses", amount: "$400,000", percentage: "47%" },
            { name: "Personnel", amount: "$300,000", percentage: "35%" },
            { name: "Marketing", amount: "$100,000", percentage: "12%" },
            { name: "Other", amount: "$50,000", percentage: "6%" },
          ],
        };
      case "profit-margin":
        return {
          grossMargin: "45%",
          operatingMargin: "35%",
          netMargin: "32%",
          analysis: "Profit margins are healthy and above industry average. Operating efficiency is strong.",
        };
      case "comparative-analysis":
        return {
          metrics: [
            { name: "Revenue", current: "$1,250,000", previous: "$1,100,000", change: "+13.6%" },
            { name: "Expenses", current: "$850,000", previous: "$780,000", change: "+9.0%" },
            { name: "Profit", current: "$400,000", previous: "$320,000", change: "+25.0%" },
          ],
        };
      default:
        return { message: "Analysis completed successfully." };
    }
  };

  const currentResult = selectedAction ? analysisResults[selectedAction] : null;

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-sm text-foreground">Quick Actions</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Select an action and materials to analyze
        </p>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Quick Actions List */}
        <div className="p-4 border-b border-border">
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Card
                  key={action.id}
                  className={`p-3 cursor-pointer transition-all ${
                    selectedAction === action.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-secondary/50"
                  }`}
                  onClick={() => setSelectedAction(action.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-md bg-secondary">
                      {action.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground">
                        {action.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {action.description}
                      </p>
                    </div>
                    {selectedAction === action.id && (
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Material Selection */}
        {selectedAction && (
          <div className="p-4 border-b border-border bg-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm text-foreground">
                Select Materials ({selectedMaterials.size} selected)
              </h3>
              {readyMaterials.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-7 text-xs"
                >
                  {selectedMaterials.size === readyMaterials.length ? "Deselect All" : "Select All"}
                </Button>
              )}
            </div>
            {readyMaterials.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No materials available. Upload files in the Materials section.
              </p>
            ) : (
              <ScrollArea className="max-h-32">
                <div className="space-y-2">
                  {readyMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 cursor-pointer"
                      onClick={() => handleMaterialToggle(material.id)}
                    >
                      <Checkbox
                        checked={selectedMaterials.has(material.id)}
                        onCheckedChange={() => handleMaterialToggle(material.id)}
                      />
                      <span className="text-sm text-foreground flex-1">
                        {material.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {material.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
            <Button
              className="w-full mt-3"
              onClick={handleRunAnalysis}
              disabled={selectedMaterials.size === 0 || isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Run Analysis"}
            </Button>
          </div>
        )}

        {/* Results Visualization */}
        <ScrollArea className="flex-1 p-4">
          {!selectedAction ? (
            <div className="text-center py-12 text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Select a quick action to begin</p>
            </div>
          ) : !currentResult ? (
            <div className="text-center py-12 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Run analysis to see results</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Analysis Results
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {currentResult.materials?.map((mat: string, idx: number) => (
                    <Badge key={idx} variant="secondary">
                      {mat}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <Card className="p-4">
                <div className="space-y-4">
                  {Object.entries(currentResult.data).map(([key, value]) => {
                    if (typeof value === "string") {
                      return (
                        <div key={key}>
                          <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <p className="text-sm text-foreground">{value}</p>
                        </div>
                      );
                    } else if (Array.isArray(value)) {
                      return (
                        <div key={key}>
                          <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <div className="space-y-2">
                            {value.map((item: any, idx: number) => (
                              <Card key={idx} className="p-3 bg-secondary/50">
                                {typeof item === "object" ? (
                                  <div className="space-y-1">
                                    {Object.entries(item).map(([k, v]) => (
                                      <div key={k} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                          {k.replace(/([A-Z])/g, " $1").trim()}
                                        </span>
                                        <span className="text-foreground font-medium">{v as string}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-foreground">{item}</p>
                                )}
                              </Card>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </Card>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
