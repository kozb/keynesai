import { useState } from "react";
import { Send, Sparkles, Paperclip, X, Bot, User, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useApp } from "@/contexts/AppContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachedMaterials?: string[];
  referencedAnalysis?: string;
  timestamp: Date;
}

export const ChatPanel = () => {
  const { materials, analysisResults } = useApp();
  const [message, setMessage] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set());
  const [showMaterialSelector, setShowMaterialSelector] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

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

  const handleSendMessage = () => {
    if (!message.trim() && selectedMaterials.size === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      attachedMaterials: selectedMaterials.size > 0 ? Array.from(selectedMaterials) : undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const attachedMaterialNames = materials
        .filter((m) => selectedMaterials.has(m.id))
        .map((m) => m.name);

      let responseContent = "";
      if (message.toLowerCase().includes("analysis") || message.toLowerCase().includes("result")) {
        // Check if user is asking about analysis results
        const analysisKeys = Object.keys(analysisResults);
        if (analysisKeys.length > 0) {
          const latestAnalysis = analysisResults[analysisKeys[analysisKeys.length - 1]];
          responseContent = `Based on the ${latestAnalysis.action} analysis, here are the key findings:\n\n`;
          if (latestAnalysis.data.summary) {
            responseContent += latestAnalysis.data.summary;
          } else if (latestAnalysis.data.analysis) {
            responseContent += latestAnalysis.data.analysis;
          } else {
            responseContent += "The analysis has been completed successfully. You can view the detailed results in the Quick Actions panel.";
          }
        } else {
          responseContent = "No analysis results are available yet. Please run a quick action analysis first.";
        }
      } else if (attachedMaterialNames.length > 0) {
        responseContent = `I've analyzed the attached materials: ${attachedMaterialNames.join(", ")}. `;
        responseContent += `Based on the content, I can help you with financial analysis, data extraction, or answer specific questions about these documents.`;
      } else {
        responseContent = "I'm here to help you with your financial analysis. You can ask me questions about your materials or the results from quick actions. Try attaching materials or asking about analysis results!";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);

    setMessage("");
    setSelectedMaterials(new Set());
    setShowMaterialSelector(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const readyMaterials = materials.filter((m) => m.status === "ready");

  return (
    <div className="h-full flex flex-col border-l border-border bg-card">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-sm text-foreground">Chat Assistant</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Ask questions about materials or analysis results
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm mb-2">Start a conversation</p>
              <div className="space-y-2 text-xs">
                <Card
                  className="p-3 cursor-pointer hover:bg-secondary/50 transition-colors text-left"
                  onClick={() => setMessage("What are the main financial insights from the attached materials?")}
                >
                  <p className="text-foreground">Ask about materials</p>
                </Card>
                <Card
                  className="p-3 cursor-pointer hover:bg-secondary/50 transition-colors text-left"
                  onClick={() => setMessage("Explain the analysis results")}
                >
                  <p className="text-foreground">Ask about analysis results</p>
                </Card>
                {readyMaterials.length > 0 && (
                  <Card
                    className="p-3 cursor-pointer hover:bg-secondary/50 transition-colors text-left"
                    onClick={() => setShowMaterialSelector(true)}
                  >
                    <p className="text-foreground">Attach materials to your question</p>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <Card
                  className={`max-w-[80%] p-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  {msg.attachedMaterials && msg.attachedMaterials.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {msg.attachedMaterials.map((matId) => {
                        const mat = materials.find((m) => m.id === matId);
                        return mat ? (
                          <Badge
                            key={matId}
                            variant="secondary"
                            className="text-xs"
                          >
                            <Paperclip className="h-2.5 w-2.5 mr-1" />
                            {mat.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </Card>
                {msg.role === "user" && (
                  <div className="p-2 rounded-full bg-secondary flex-shrink-0">
                    <User className="h-4 w-4 text-foreground" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Material Selector */}
      {showMaterialSelector && (
        <div className="p-3 border-t border-border bg-secondary/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-foreground">Attach Materials</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={() => {
                setShowMaterialSelector(false);
                setSelectedMaterials(new Set());
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <ScrollArea className="max-h-24">
            <div className="space-y-2">
              {readyMaterials.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No materials available
                </p>
              ) : (
                readyMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-background/50 cursor-pointer"
                    onClick={() => handleMaterialToggle(material.id)}
                  >
                    <Checkbox
                      checked={selectedMaterials.has(material.id)}
                      onCheckedChange={() => handleMaterialToggle(material.id)}
                    />
                    <span className="text-xs text-foreground flex-1 truncate">
                      {material.name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {material.type}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Analysis Results Quick Access */}
      {Object.keys(analysisResults).length > 0 && (
        <div className="p-3 border-t border-border bg-secondary/30">
          <p className="text-xs font-medium text-foreground mb-2">Available Analyses</p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(analysisResults).map(([key, result]) => (
              <Badge
                key={key}
                variant="outline"
                className="text-xs cursor-pointer hover:bg-secondary"
                onClick={() => setMessage(`Explain the ${result.action} analysis results`)}
              >
                <BarChart3 className="h-2.5 w-2.5 mr-1" />
                {result.action}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          {readyMaterials.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              onClick={() => setShowMaterialSelector(!showMaterialSelector)}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          )}
          <Input
            placeholder="Ask a question or attach materials..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!message.trim() && selectedMaterials.size === 0}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {selectedMaterials.size > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {Array.from(selectedMaterials).map((matId) => {
              const mat = materials.find((m) => m.id === matId);
              return mat ? (
                <Badge key={matId} variant="secondary" className="text-xs">
                  {mat.name}
                  <button
                    onClick={() => handleMaterialToggle(matId)}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};