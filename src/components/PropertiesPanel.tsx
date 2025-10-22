import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useCanvasStore, CanvasElement } from "@/store/canvasStore";
import { useShallow } from 'zustand/react/shallow';
export function PropertiesPanel() {
  const { selectedElementId, elements, updateElement, _commit } = useCanvasStore(
    useShallow((state) => ({
      selectedElementId: state.selectedElementId,
      elements: state.elements,
      updateElement: state.updateElement,
      _commit: state._commit,
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
    const numericKeys: (keyof CanvasElement)[] = ['x', 'y', 'width', 'height', 'rotation', 'opacity'];
    let parsedValue = value;
    if (numericKeys.includes(key)) {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        parsedValue = key === 'opacity' ? 1 : 0; // Default opacity to 1, others to 0
      }
    }
    setLocalState(prevState => ({ ...prevState, [key]: parsedValue }));
    updateElement(selectedElement.id, { [key]: parsedValue });
  };
  const handleCommit = () => {
    _commit();
  };
  if (!selectedElement) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-display">Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-full text-muted-foreground text-center p-4">
            <p>Select an element on the canvas to edit its properties here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-display capitalize">{selectedElement.type} Properties</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-6">
        {selectedElement.type === 'text' && (
          <div className="space-y-2">
            <Label htmlFor="textContent">Text Content</Label>
            <Textarea
              id="textContent"
              value={localState.textContent || ''}
              onChange={(e) => handleInputChange('textContent', e.target.value)}
              onBlur={handleCommit}
              className="min-h-[80px]"
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="x">X</Label>
            <Input id="x" type="number" value={Math.round(localState.x || 0)} onChange={(e) => handleInputChange('x', e.target.value)} onBlur={handleCommit} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="y">Y</Label>
            <Input id="y" type="number" value={Math.round(localState.y || 0)} onChange={(e) => handleInputChange('y', e.target.value)} onBlur={handleCommit} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="width">Width</Label>
            <Input id="width" type="number" value={Math.round(localState.width || 0)} onChange={(e) => handleInputChange('width', e.target.value)} onBlur={handleCommit} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height</Label>
            <Input id="height" type="number" value={Math.round(localState.height || 0)} onChange={(e) => handleInputChange('height', e.target.value)} onBlur={handleCommit} />
          </div>
        </div>
        {(selectedElement.type === 'rectangle' || selectedElement.type === 'circle' || selectedElement.type === 'text' || selectedElement.type === 'triangle' || selectedElement.type === 'star') && (
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="color"
                type="color"
                value={localState.color || '#000000'}
                onChange={(e) => handleInputChange('color', e.target.value)}
                onBlur={handleCommit}
                className="p-1 h-10 w-14"
              />
              <Input
                type="text"
                value={localState.color || ''}
                onChange={(e) => handleInputChange('color', e.target.value)}
                onBlur={handleCommit}
                className="flex-1"
              />
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="rotation">Rotation</Label>
          <div className="flex items-center gap-2">
            <Slider
              id="rotation"
              min={0}
              max={360}
              step={1}
              value={[localState.rotation || 0]}
              onValueChange={([value]) => handleInputChange('rotation', value)}
              onValueCommit={handleCommit}
            />
            <Input type="number" value={localState.rotation || 0} onChange={(e) => handleInputChange('rotation', e.target.value)} onBlur={handleCommit} className="w-20" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="opacity">Opacity</Label>
          <div className="flex items-center gap-2">
            <Slider
              id="opacity"
              min={0}
              max={1}
              step={0.01}
              value={[localState.opacity ?? 1]}
              onValueChange={([value]) => handleInputChange('opacity', value)}
              onValueCommit={handleCommit}
            />
            <Input type="number" value={Math.round((localState.opacity ?? 1) * 100)} onChange={(e) => handleInputChange('opacity', parseInt(e.target.value, 10) / 100)} onBlur={handleCommit} className="w-20" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="border">Border</Label>
          <Input
            id="border"
            type="text"
            placeholder="e.g., 2px solid #000000"
            value={localState.border || ''}
            onChange={(e) => handleInputChange('border', e.target.value)}
            onBlur={handleCommit}
          />
        </div>
      </CardContent>
    </Card>
  );
}