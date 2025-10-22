import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/Header';
import { MediaLibraryPanel } from '@/components/MediaLibraryPanel';
import { AIDesignAssistantPanel } from '@/components/AIDesignAssistantPanel';
import { DesignCanvas } from '@/components/DesignCanvas';
import { LayersPanel } from '@/components/LayersPanel';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PanelLeft, Layers } from 'lucide-react';
import { useCanvasStore, CanvasElement } from '@/store/canvasStore';
export function HomePage() {
  const isMobile = useIsMobile();
  const addElement = useCanvasStore((state) => state.addElement);
  const selectedElementId = useCanvasStore((state) => state.selectedElementId);
  const handleAddElement = (element: Omit<CanvasElement, 'id'>) => {
    addElement(element);
  };
  const DesktopLayout = () => (
    <ResizablePanelGroup direction="horizontal" className="flex-1 w-full h-full p-4 md:p-6 lg:p-8 gap-6">
      <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
        <div className="flex flex-col gap-6 h-full">
          <div className="flex-1 min-h-0">
            <MediaLibraryPanel onAddElement={handleAddElement} />
          </div>
          <div className="flex-1 min-h-0">
            <AIDesignAssistantPanel />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60} minSize={40}>
        <DesignCanvas />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
        <LayersPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
  const MobileLayout = () => (
    <div className="flex-1 flex flex-col p-4 gap-4">
      <div className="flex gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 flex-1">
              <PanelLeft className="h-4 w-4" />
              <span>Tools & AI</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] sm:w-[400px] p-0">
            <div className="flex flex-col gap-6 h-full p-4">
              <div className="flex-1">
                <MediaLibraryPanel onAddElement={handleAddElement} />
              </div>
              <div className="flex-1">
                <AIDesignAssistantPanel />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 flex-1" disabled={!selectedElementId}>
              <Layers className="h-4 w-4" />
              <span>Layers</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0">
            <LayersPanel />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex-1 min-h-0">
        <DesignCanvas />
      </div>
    </div>
  );
  return (
    <AppLayout>
      <div className="relative flex flex-col h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh-hero" />
        <Header />
        {isMobile ? <MobileLayout /> : <DesktopLayout />}
      </div>
    </AppLayout>
  );
}