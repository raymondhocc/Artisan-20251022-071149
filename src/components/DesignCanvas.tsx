import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Type, Square, Circle, Undo, Redo, Trash2, Download, ArrowUpFromLine, ArrowDownToLine, Loader2, Triangle, Star } from "lucide-react";
import { useCanvasStore } from "@/store/canvasStore";
import { CanvasElement } from "@/components/canvas/CanvasElement";
import html2canvas from 'html2canvas';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useShallow } from 'zustand/react/shallow';
const PRESET_SIZES = {
  'poster': { width: 800, height: 1200, label: 'Poster' },
  'square': { width: 1080, height: 1080, label: 'Square' },
  'landscape': { width: 1920, height: 1080, label: 'Landscape' },
  'custom': { width: 0, height: 0, label: 'Custom' },
};
export function DesignCanvas() {
  const { elements, selectedElementId, canvasWidth, canvasHeight } = useCanvasStore(
    useShallow((state) => ({
      elements: state.elements,
      selectedElementId: state.selectedElementId,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
    }))
  );
  const addElement = useCanvasStore((state) => state.addElement);
  const deleteElement = useCanvasStore((state) => state.deleteElement);
  const setSelectedElementId = useCanvasStore((state) => state.setSelectedElementId);
  const undo = useCanvasStore((state) => state.undo);
  const redo = useCanvasStore((state) => state.redo);
  const bringToFront = useCanvasStore((state) => state.bringToFront);
  const sendToBack = useCanvasStore((state) => state.sendToBack);
  const setCanvasDimensions = useCanvasStore((state) => state.setCanvasDimensions);
  const updateElement = useCanvasStore((state) => state.updateElement);
  const commit = useCanvasStore((state) => state._commit);
  const [isExporting, setIsExporting] = useState(false);
  const [currentPreset, setCurrentPreset] = useState('poster');
  const [customWidth, setCustomWidth] = useState(canvasWidth.toString());
  const [customHeight, setCustomHeight] = useState(canvasHeight.toString());
  useEffect(() => {
    setCustomWidth(canvasWidth.toString());
    setCustomHeight(canvasHeight.toString());
    const matchingPreset = Object.keys(PRESET_SIZES).find(key => {
      const preset = PRESET_SIZES[key as keyof typeof PRESET_SIZES];
      return preset.width === canvasWidth && preset.height === canvasHeight;
    });
    setCurrentPreset(matchingPreset || 'custom');
  }, [canvasWidth, canvasHeight]);
  const handlePresetChange = (value: string) => {
    if (value !== 'custom') {
      const preset = PRESET_SIZES[value as keyof typeof PRESET_SIZES];
      setCanvasDimensions(preset.width, preset.height);
    }
    setCurrentPreset(value);
  };
  const handleDimensionChange = () => {
    const width = parseInt(customWidth, 10);
    const height = parseInt(customHeight, 10);
    if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
      setCanvasDimensions(width, height);
    }
  };
  const handleDelete = () => {
    if (selectedElementId) {
      deleteElement(selectedElementId);
    }
  };
  const handleBringToFront = () => {
    if (selectedElementId) {
      bringToFront(selectedElementId);
    }
  };
  const handleSendToBack = () => {
    if (selectedElementId) {
      sendToBack(selectedElementId);
    }
  };
  const handleExport = async () => {
    const canvasArea = document.getElementById('canvas-area');
    if (!canvasArea) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(canvasArea, {
        backgroundColor: null,
        scale: 2,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'artisan-canvas-design.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to export canvas:", error);
    } finally {
      setIsExporting(false);
    }
  };
  const toolbarActions = [
    { icon: Type, tooltip: "Add Text", action: () => addElement({ type: 'text', x: 50, y: 150, width: 250, height: 50, color: '#333333', textContent: 'Hello Artisan', fontFamily: 'Inter', fontSize: 24, fontWeight: 'normal' }) },
    { icon: Square, tooltip: "Add Rectangle", action: () => addElement({ type: 'rectangle', x: 100, y: 200, width: 150, height: 100, color: '#3b82f6' }) },
    { icon: Circle, tooltip: "Add Circle", action: () => addElement({ type: 'circle', x: 150, y: 300, width: 100, height: 100, color: '#ef4444' }) },
    { icon: Triangle, tooltip: "Add Triangle", action: () => addElement({ type: 'triangle', x: 200, y: 100, width: 120, height: 120, color: '#22c55e' }) },
    { icon: Star, tooltip: "Add Star", action: () => addElement({ type: 'star', x: 250, y: 250, width: 120, height: 120, color: '#eab308' }) },
  ];
  const historyActions = [
    { icon: Undo, tooltip: "Undo", action: undo },
    { icon: Redo, tooltip: "Redo", action: redo },
  ];
  const layerActions = [
    { icon: ArrowUpFromLine, tooltip: "Bring to Front", action: handleBringToFront, disabled: !selectedElementId },
    { icon: ArrowDownToLine, tooltip: "Send to Back", action: handleSendToBack, disabled: !selectedElementId },
  ];
  return (
    <div className="flex flex-col h-full gap-6">
      <Card className="flex-shrink-0">
        <div className="p-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 flex-wrap">
            <TooltipProvider>
              {toolbarActions.map((item, index) => (
                <Tooltip key={`tool-${index}`}><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={item.action}><item.icon className="h-5 w-5" /></Button></TooltipTrigger><TooltipContent><p>{item.tooltip}</p></TooltipContent></Tooltip>
              ))}
              <div className="w-px h-6 bg-border mx-2" />
              {historyActions.map((item, index) => (
                <Tooltip key={`history-${index}`}><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={item.action}><item.icon className="h-5 w-5" /></Button></TooltipTrigger><TooltipContent><p>{item.tooltip}</p></TooltipContent></Tooltip>
              ))}
              <div className="w-px h-6 bg-border mx-2" />
              {layerActions.map((item, index) => (
                <Tooltip key={`layer-${index}`}><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={item.action} disabled={item.disabled}><item.icon className="h-5 w-5" /></Button></TooltipTrigger><TooltipContent><p>{item.tooltip}</p></TooltipContent></Tooltip>
              ))}
              <div className="w-px h-6 bg-border mx-2" />
              <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={handleDelete} disabled={!selectedElementId}><Trash2 className="h-5 w-5" /></Button></TooltipTrigger><TooltipContent><p>Delete Selected</p></TooltipContent></Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2">
            <Select value={currentPreset} onValueChange={handlePresetChange}>
              <SelectTrigger className="w-[120px]"><SelectValue placeholder="Size" /></SelectTrigger>
              <SelectContent>
                {Object.entries(PRESET_SIZES).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="number" value={customWidth} onChange={(e) => setCustomWidth(e.target.value)} onBlur={handleDimensionChange} className="w-20" placeholder="W" />
            <span className="text-muted-foreground">×</span>
            <Input type="number" value={customHeight} onChange={(e) => setCustomHeight(e.target.value)} onBlur={handleDimensionChange} className="w-20" placeholder="H" />
            <Button onClick={handleExport} disabled={isExporting} className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold w-[110px]">
              {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>
      </Card>
      <Card className="flex-1 w-full h-full overflow-auto">
        <CardContent className="p-0 h-full">
          <div className="bg-secondary w-full h-full flex items-center justify-center p-8">
            <div
              id="canvas-area"
              className="relative bg-white dark:bg-card shadow-inner flex-shrink-0"
              style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
              onPointerDown={() => setSelectedElementId(null)}
            >
              {elements.map((el) => (
                <CanvasElement
                  key={el.id}
                  {...el}
                  isSelected={selectedElementId === el.id}
                  onSelect={setSelectedElementId}
                  onUpdate={updateElement}
                  onCommit={commit}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}