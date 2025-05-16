import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ImageUploadProps {
  value?: File | string;
  onChange: (value?: File | string) => void;
  onRemove: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onChange(e.target.files[0]);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative group">
          <div className="aspect-video rounded-md overflow-hidden border">
            {typeof value === "string" ? (
              <img
                src={value}
                alt="Workspace preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <img
                src={URL.createObjectURL(value)}
                alt="Workspace preview"
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4">
            <ImagePlus className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">Upload an image</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="relative"
            >
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              Select Image
            </Button>
          </div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Or enter image URL"
              onChange={handleUrlChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};