import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export const NotebookContent = () => {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">AI-Generated Insights</h2>
          <p className="text-sm text-muted-foreground">Based on your sources</p>
        </div>

        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">Key Findings</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Your sources discuss artificial intelligence and machine learning fundamentals. 
                The main themes include neural networks, deep learning architectures, and their 
                practical applications in modern technology.
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Summary</h3>
          
          <Card className="p-5 hover:shadow-md transition-shadow">
            <h4 className="font-medium text-foreground mb-2">Neural Networks</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Neural networks form the foundation of modern AI systems. They consist of 
              interconnected nodes organized in layers that process and transform data to 
              learn patterns and make predictions.
            </p>
          </Card>

          <Card className="p-5 hover:shadow-md transition-shadow">
            <h4 className="font-medium text-foreground mb-2">Deep Learning</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deep learning extends neural networks with multiple hidden layers, enabling 
              the model to learn hierarchical representations of data. This approach has 
              revolutionized computer vision, natural language processing, and more.
            </p>
          </Card>

          <Card className="p-5 hover:shadow-md transition-shadow">
            <h4 className="font-medium text-foreground mb-2">Practical Applications</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Modern AI applications span from image recognition and language translation 
              to autonomous systems and recommendation engines, transforming industries 
              across the globe.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
