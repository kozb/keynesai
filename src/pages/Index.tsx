import { Header } from "@/components/Header";
import { MaterialsPanel } from "@/components/MaterialsPanel";
import { QuickActionsPanel } from "@/components/QuickActionsPanel";
import { ChatPanel } from "@/components/ChatPanel";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
            <MaterialsPanel />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={45} minSize={30} maxSize={60}>
            <QuickActionsPanel />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={30} minSize={20} maxSize={45}>
            <ChatPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;
