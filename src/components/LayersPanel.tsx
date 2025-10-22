import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCanvasStore, CanvasElement } from "@/store/canvasStore";
import { useShallow } from 'zustand/react/shallow';
import { Type, Square, Circle, Image as ImageIcon, Triangle, Star, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const elementIcons: { [key in CanvasElement['type']]: React.ElementType } = {
  text: Type,
  rectangle: Square,
  circle: Circle,
  image: ImageIcon,
  triangle: Triangle,
  star: Star,
};
const FONT_FAMILIES = ['Inter', 'DM Sans', 'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];
const FONT_WEIGHTS = ['100', '200', '300', 'normal', '500', '600', 'bold', '800', '900'];
export function LayersPanel() {
  const { selectedElementId, elements, updateElement, _commit, setSelectedElementId, bringToFront, sendToBack } = useCanvasStore(
    useShallow((state) => ({
      selectedElementId: state.selectedElementId,
      elements: state.elements,
      updateElement: state.updateElement,
      _commit: state._commit,
      setSelectedElementId: state.setSelectedElementId,
      bringToFront: state.bringToFront,
      sendToBack: state.sendToBack,
    }))
  );
  const selectedElement = elements.find(el => el.id === selectedElementId);
  const [localState, setLocalState] = useState<Partial<CanvasElement>>({});
  useEffect(() => {
    if (selectedElement) {
      setLocalState(selectedElement);
    }
  }, [selectedElement]);
  const handleInputChange = (key: keyof CanvasElement, value: any) => {
    if (!selectedElement) return;
    const numericKeys: (keyof CanvasElement)[] = ['x', 'y', 'width', 'height', 'rotation', 'opacity', 'fontSize'];
    let parsedValue = value;
    if (numericKeys.includes(key)) {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        parsedValue = key === 'opacity' ? 1 : 0;
      }
    }
    setLocalState(prevState => ({ ...prevState, [key]: parsedValue }));
    updateElement(selectedElement.id, { [key]: parsedValue });
  };
  const handleCommit = () => {
    _commit();
  };
  const renderProperties = () => {
    if (!selectedElement) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground text-center p-4">
          <p>Select a layer to edit its properties.</p>
        </div>
      );
    }
    return (
      <div className="p-4 space-y-6">
        <h3 className="font-semibold capitalize">{selectedElement.type} Properties</h3>
        {selectedElement.type === 'text' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="textContent">Text Content</Label>
              <Textarea id="textContent" value={localState.textContent || ''} onChange={(e) => handleInputChange('textContent', e.target.value)} onBlur={handleCommit} className="min-h-[80px]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fontFamily">Font Family</Label>
              <Select value={localState.fontFamily} onValueChange={(value) => { handleInputChange('fontFamily', value); handleCommit(); }}>
                <SelectTrigger><SelectValue placeholder="Select a font" /></SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map(font => <SelectItem key={font} value={font}>{font}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Input id="fontSize" type="number" value={localState.fontSize || 24} onChange={(e) => handleInputChange('fontSize', e.target.value)} onBlur={handleCommit} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fontWeight">Font Weight</Label>
                <Select value={localState.fontWeight} onValueChange={(value) => { handleInputChange('fontWeight', value); handleCommit(); }}>
                  <SelectTrigger><SelectValue placeholder="Select weight" /></SelectTrigger>
                  <SelectContent>
                    {FONT_WEIGHTS.map(weight => <SelectItem key={weight} value={weight}>{weight}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label htmlFor="x">X</Label><Input id="x" type="number" value={Math.round(localState.x || 0)} onChange={(e) => handleInputChange('x', e.target.value)} onBlur={handleCommit} /></div>
          <div className="space-y-2"><Label htmlFor="y">Y</Label><Input id="y" type="number" value={Math.round(localState.y || 0)} onChange={(e) => handleInputChange('y', e.target.value)} onBlur={handleCommit} /></div>
          <div className="space-y-2"><Label htmlFor="width">Width</Label><Input id="width" type="number" value={Math.round(localState.width || 0)} onChange={(e) => handleInputChange('width', e.target.value)} onBlur={handleCommit} /></div>
          <div className="space-y-2"><Label htmlFor="height">Height</Label><Input id="height" type="number" value={Math.round(localState.height || 0)} onChange={(e) => handleInputChange('height', e.target.value)} onBlur={handleCommit} /></div>
        </div>
        {(selectedElement.type !== 'image') && (
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center gap-2">
              <Input id="color" type="color" value={localState.color || '#000000'} onChange={(e) => handleInputChange('color', e.target.value)} onBlur={handleCommit} className="p-1 h-10 w-14" />
              <Input type="text" value={localState.color || ''} onChange={(e) => handleInputChange('color', e.target.value)} onBlur={handleCommit} className="flex-1" />
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="rotation">Rotation</Label>
          <div className="flex items-center gap-2">
            <Slider id="rotation" min={0} max={360} step={1} value={[localState.rotation || 0]} onValueChange={([value]) => handleInputChange('rotation', value)} onValueCommit={handleCommit} />
            <Input type="number" value={localState.rotation || 0} onChange={(e) => handleInputChange('rotation', e.target.value)} onBlur={handleCommit} className="w-20" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="opacity">Opacity</Label>
          <div className="flex items-center gap-2">
            <Slider id="opacity" min={0} max={1} step={0.01} value={[localState.opacity ?? 1]} onValueChange={([value]) => handleInputChange('opacity', value)} onValueCommit={handleCommit} />
            <Input type="number" value={Math.round((localState.opacity ?? 1) * 100)} onChange={(e) => handleInputChange('opacity', parseInt(e.target.value, 10) / 100)} onBlur={handleCommit} className="w-20" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="border">Border</Label>
          <Input id="border" type="text" placeholder="e.g., 2px solid #000" value={localState.border || ''} onChange={(e) => handleInputChange('border', e.target.value)} onBlur={handleCommit} />
        </div>
      </div>
    );
  };
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-display">Layers</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
        <div className="px-4 pb-4">
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="icon" onClick={() => selectedElementId && bringToFront(selectedElementId)} disabled={!selectedElementId}><ArrowUp className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => selectedElementId && sendToBack(selectedElementId)} disabled={!selectedElementId}><ArrowDown className="h-4 w-4" /></Button>
          </div>
        </div>
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2">
            {[...elements].reverse().map(el => {
              const Icon = elementIcons[el.type];
              return (
                <div
                  key={el.id}
                  onClick={() => setSelectedElementId(el.id)}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors",
                    selectedElementId === el.id ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate flex-1 text-sm">{el.type === 'text' ? el.textContent : el.type}</span>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <Separator className="my-4" />
        <ScrollArea className="flex-1">
          {renderProperties()}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}