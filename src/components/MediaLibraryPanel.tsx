import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Star, Shapes } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CanvasElement } from "@/store/canvasStore";
type MediaLibraryPanelProps = {
  onAddElement: (element: Omit<CanvasElement, 'id'>) => void;
};
export function MediaLibraryPanel({ onAddElement }: MediaLibraryPanelProps) {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [imageUploadUrl, setImageUploadUrl] = useState('');
  const mockAssets = [
    { type: 'icon', icon: ImageIcon, seed: 'abstract' },
    { type: 'icon', icon: Star, seed: 'galaxy' },
    { type: 'icon', icon: Shapes, seed: 'geometric' },
    { type: 'image', seed: 'nature' },
    { type: 'image', seed: 'architecture' },
    { type: 'image', seed: 'technology' },
    { type: 'image', seed: 'animals' },
    { type: 'image', seed: 'food' },
    { type: 'image', seed: 'travel' },
  ];
  const isLoading = false;
  const handleAddImage = (seed: string) => {
    onAddElement({
      type: 'image',
      x: 50,
      y: 50,
      width: 300,
      height: 200,
      color: '',
      imageSrc: `https://source.unsplash.com/random/400x300/?${seed}`,
    });
  };
  const handleAddImageUrl = () => {
    if (imageUploadUrl.trim()) {
      onAddElement({
        type: 'image',
        x: 50,
        y: 50,
        width: 300,
        height: 200,
        color: '',
        imageSrc: imageUploadUrl.trim(),
      });
      setImageUploadUrl('');
      setShowUploadDialog(false);
    }
  };
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl font-bold font-display">Media Library</CardTitle>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload Media</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Image from URL</DialogTitle>
              <DialogDescription>
                Paste an image URL below to add it to your canvas.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="imageUrl"
                  value={imageUploadUrl}
                  onChange={(e) => setImageUploadUrl(e.target.value)}
                  className="col-span-3"
                  placeholder="https://example.com/image.png"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddImageUrl}>Add to Canvas</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-4">
          {isLoading
            ? Array(9).fill(0).map((_, index) => (
                <Skeleton key={index} className="aspect-square rounded-lg" />
              ))
            : mockAssets.map((asset, index) => {
                if (asset.type === 'image') {
                  return (
                    <div
                      key={index}
                      className="aspect-square bg-secondary rounded-lg cursor-pointer overflow-hidden
                                 transition-all duration-200 ease-in-out group
                                 hover:shadow-md hover:-translate-y-0.5"
                      onClick={() => handleAddImage(asset.seed)}
                    >
                      <img
                        src={`https://source.unsplash.com/random/100x100/?${asset.seed}&${index}`}
                        alt={asset.seed}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  );
                }
                const Icon = asset.icon;
                return (
                  <div
                    key={index}
                    className="aspect-square bg-secondary rounded-lg flex items-center justify-center cursor-pointer
                               transition-all duration-200 ease-in-out
                               hover:shadow-md hover:-translate-y-0.5 hover:bg-muted"
                    onClick={() => handleAddImage(asset.seed)}
                  >
                    <Icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                );
              })}
        </div>
      </CardContent>
    </Card>
  );
}