"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ImageIcon } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  aspectRatio?: number;
  className?: string;
  showNavigation?: boolean;
  showCounter?: boolean;
  fallbackIcon?: React.ReactNode;
  hoverEffect?: boolean;
}

export default function ImageCarousel({
  images,
  alt,
  aspectRatio = 4 / 3,
  className = "",
  showNavigation = true,
  showCounter = true,
  fallbackIcon,
  hoverEffect = true,
}: ImageCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // If no images are provided, show fallback
  if (!images || images.length === 0) {
    return (
      <AspectRatio
        ratio={aspectRatio}
        className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 ${className}`}
      >
        <div className="w-full h-full flex items-center justify-center">
          {fallbackIcon || <ImageIcon className="w-12 h-12 text-gray-400" />}
        </div>
      </AspectRatio>
    );
  }

  // If only one image, don't show carousel
  if (images.length === 1) {
    return (
      <AspectRatio
        ratio={aspectRatio}
        className={`relative overflow-hidden ${className}`}
      >
        <Image
          src={images[0]}
          alt={alt}
          onError={(e) => {
            e.currentTarget.src = "/images/fallback.png"; // Fallback image
          }}
          fill
          className={`object-cover ${
            hoverEffect
              ? "transition-transform duration-300 group-hover:scale-105"
              : ""
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </AspectRatio>
    );
  }

  // Multiple images - show carousel
  return (
    <div className={`relative ${className}`}>
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <AspectRatio
                ratio={aspectRatio}
                className="relative overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`${alt} - Image ${index + 1}`}
                  fill
                  className={`object-cover ${
                    hoverEffect
                      ? "transition-transform duration-300 group-hover:scale-105"
                      : ""
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>

        {showNavigation && images.length > 1 && (
          <>
            <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 border-0 text-white hover:bg-black/70 w-8 h-8" />
            <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 border-0 text-white hover:bg-black/70 w-8 h-8" />
          </>
        )}

        {/* Image counter */}
        {showCounter && images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {current} / {images.length}
          </div>
        )}
      </Carousel>
    </div>
  );
}
