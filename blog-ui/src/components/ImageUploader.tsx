import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { X, Upload } from "lucide-react";

interface ImageUploaderProps {
  previewUrl: string;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

export function ImageUploader({ previewUrl, onSelect, onRemove }: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onSelect(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) onSelect(file);
  }

  return (
    <div className="space-y-3">
      {!previewUrl && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition
            ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-8 w-8 text-gray-500 mb-2" />
          <p className="text-gray-600">Drag & drop an image here</p>
          <p className="text-gray-400 text-sm mb-3">or</p>

          <Button variant="outline" asChild>
            <label>
              Choose File
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </Button>
        </div>
      )}

      {previewUrl && (
        <Card className="relative w-full max-w-md">
          <CardContent className="p-0">
            <AspectRatio ratio={16 / 9}>
              <img
                src={previewUrl}
                alt="Preview"
                className="rounded-lg object-cover w-full h-full"
              />
            </AspectRatio>

            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
