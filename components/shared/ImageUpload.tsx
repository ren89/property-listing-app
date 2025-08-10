"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/shared";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { uploadPropertyImages } from "@/app/actions/properties";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  required?: boolean;
}

export default function ImageUpload({
  images,
  onChange,
  maxImages = 5,
  label = "Property Images",
  required = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Check if adding these files would exceed maxImages
    const totalImages = images.length + selectedFiles.length + files.length;
    if (totalImages > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate file types and sizes
    const invalidFiles = files.filter(
      (file) => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024
    );

    if (invalidFiles.length > 0) {
      alert("Please select only image files under 5MB");
      return;
    }

    // Add files to selected files for preview
    setSelectedFiles((prev) => [...prev, ...files]);

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadSelectedFiles = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    try {
      console.log("Uploading files:", selectedFiles);
      const result = await uploadPropertyImages(selectedFiles);
      console.log("Upload result:", result);

      if (result.error) {
        throw new Error(result.error);
      }

      const newUrls = result.urls || [];
      console.log("New URLs:", newUrls);
      onChange([...images, ...newUrls]);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const totalImages = images.length + selectedFiles.length;

  return (
    <div className="space-y-4">
      <div>
        <Label className="block text-sm font-medium mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>

        {/* Upload Button */}
        {totalImages < maxImages && (
          <div className="mb-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleButtonClick}
              disabled={uploading}
              className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
            >
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {uploading ? "Uploading..." : "Click to select images"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalImages}/{maxImages} images
                </p>
              </div>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}

        {selectedFiles.length > 0 && (
          <div className="mb-4">
            <Button
              type="button"
              onClick={uploadSelectedFiles}
              disabled={uploading}
              className="w-full"
            >
              {uploading
                ? "Uploading..."
                : `Upload ${selectedFiles.length} Selected Image${
                    selectedFiles.length > 1 ? "s" : ""
                  }`}
            </Button>
          </div>
        )}

        {/* Image Preview Grid */}
        {(images.length > 0 || selectedFiles.length > 0) && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {/* Uploaded Images */}
            {images.map((image, index) => {
              console.log(`Rendering uploaded image ${index + 1}:`, image);
              return (
                <div key={`uploaded-${index}`} className="relative group">
                  <AspectRatio
                    ratio={4 / 3}
                    className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                  >
                    <Image
                      src={image}
                      alt={`Property image ${index + 1}`}
                      fill
                      className="object-cover group-hover:opacity-80 transition-opacity duration-200"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      priority={index === 0}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 p-0 z-10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </AspectRatio>
                  <p className="text-xs text-green-600 mt-1 text-center font-medium">
                    ✓ Uploaded
                  </p>
                </div>
              );
            })}

            {/* Selected Files Preview */}
            {selectedFiles.map((file, index) => {
              const previewUrl = URL.createObjectURL(file);
              console.log(
                `Creating preview for file: ${file.name}, URL: ${previewUrl}`
              );

              return (
                <div key={`selected-${index}`} className="relative group">
                  <AspectRatio
                    ratio={4 / 3}
                    className="overflow-hidden rounded-lg border border-blue-300 bg-blue-50"
                  >
                    <Image
                      src={previewUrl}
                      alt={`Selected image ${index + 1} - ${file.name}`}
                      fill
                      className="object-cover group-hover:opacity-80 transition-opacity duration-200"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        URL.revokeObjectURL(previewUrl);
                        removeSelectedFile(index);
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 p-0 z-10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </AspectRatio>
                  <p className="text-xs text-blue-600 mt-1 text-center font-medium">
                    Ready to upload
                  </p>
                  <p className="text-xs text-gray-400 mt-1 text-center truncate">
                    {file.name}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {images.length === 0 && selectedFiles.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">No images uploaded</p>
            <p className="text-xs text-gray-500">
              Click the upload button above to add property images
            </p>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2">
          Supported formats: JPG, PNG, WebP. Max {maxImages} images.
        </p>
      </div>
    </div>
  );
}
