"use client";

import React, { useState, useEffect } from "react";
import { PropertyListing, PropertyType } from "@/types/property";
import { PriceBadge, StatusBadge, ImageCarousel } from "@/components/shared";
import { MapPin, Home, Calendar, Building2, Warehouse, X } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PropertyDetailsSheetProps {
  property: PropertyListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyDetailsSheet({ 
  property, 
  isOpen, 
  onClose 
}: PropertyDetailsSheetProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 640); // sm breakpoint
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!property) return null;

  const getTypeIcon = (type: PropertyType) => {
    switch (type) {
      case PropertyType.House:
        return <Home className="w-5 h-5" />;
      case PropertyType.Apartment:
        return <Building2 className="w-5 h-5" />;
      case PropertyType.Commercial:
        return <Warehouse className="w-5 h-5" />;
      default:
        return <Home className="w-5 h-5" />;
    }
  };

  const handleContactAgent = () => {
    toast.info("🚀 Coming Soon!", {
      description: "Contact agent feature is currently under development. Stay tuned!"
    });
  };

  const handleSaveProperty = () => {
    toast.info("🚀 Coming Soon!", {
      description: "Save property feature is currently under development. Stay tuned!"
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose} >
      <SheetContent 
        side={isDesktop ? "right" : "bottom"}
        className={cn(
          "p-0 overflow-hidden [&>button]:hidden",
          isDesktop ? [
            "h-full w-[650px] max-w-[90vw] rounded-none border-l border-t-0"
          ] : [
            "h-[85vh] rounded-t-2xl border-t"
          ]
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header with close button - mobile only */}
          {!isDesktop && (
            <SheetHeader className="p-4 pb-2 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />
              </div>
            </SheetHeader>
          )}

          {/* Header for web */}
          {isDesktop && (
            <SheetHeader className="p-6 pb-4 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-xl font-semibold">Property Details</SheetTitle>
                <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </SheetClose>
              </div>
            </SheetHeader>
          )}

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            {/* Image carousel */}
            <div className="relative">
              <ImageCarousel
                images={property.image || []}
                alt={property.title}
                aspectRatio={isDesktop ? 4 / 3 : 16 / 9}
                fallbackIcon={<Home className="w-16 h-16 text-gray-400" />}
                showNavigation={isDesktop}
                hoverEffect={false}
              />
              
              <StatusBadge
                status={property.status}
                className="absolute top-4 left-4 z-10"
              />
              
              <PriceBadge
                price={property.price}
                status={property.status}
                className="absolute top-4 right-4 z-10"
              />
            </div>

            {/* Property details */}
            <div className={cn("space-y-6", isDesktop ? "p-6" : "p-6")}>
              {/* Title and basic info */}
              <div className={cn("space-y-4", isDesktop && "space-y-3")}>
                {!isDesktop && (
                  <SheetTitle className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                    {property.title}
                  </SheetTitle>
                )}
                {isDesktop && (
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                    {property.title}
                  </h1>
                )}
                
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  <span className="text-base">{property.location}</span>
                </div>

                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(property.property_type)}
                    <span className="capitalize text-base">{property.property_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-base">Listed {formatDate(property.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Price section */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {property.status === "ForRent" ? "Monthly Rent" : "Price"}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${property.price.toLocaleString()}
                      {property.status === "ForRent" && (
                        <span className="text-base font-normal text-gray-600 dark:text-gray-400">
                          /month
                        </span>
                      )}
                    </p>
                  </div>
                  <StatusBadge status={property.status} className="text-base px-3 py-1" />
                </div>
              </div>

              {/* Description section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>

              {/* Property details grid */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Property Details
                </h3>
                <div className={cn("grid gap-4", isDesktop ? "grid-cols-1" : "grid-cols-2")}>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Type</p>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(property.property_type)}
                      <span className="font-medium capitalize text-gray-900 dark:text-white">
                        {property.property_type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                    <StatusBadge status={property.status} />
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Listed Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(property.created_at)}
                    </p>
                  </div>
                  
                  {/* <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Updated</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(property.updated_at)}
                    </p>
                  </div> */}
                </div>
              </div>

              {/* Contact section */}
              <div className="space-y-3 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Interested?
                </h3>
                <div className={cn("grid gap-3", isDesktop ? "grid-cols-1" : "grid-cols-2")}>
                  <button onClick={handleContactAgent} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                    Contact Agent
                  </button>
                  <button onClick={handleSaveProperty} className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors">
                    Save Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
