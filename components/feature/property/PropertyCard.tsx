"use client";

import React from "react";
import { PropertyListing, PropertyType } from "@/types/property";
import { PriceBadge, StatusBadge, ImageCarousel } from "@/components/shared";
import { MapPin, Home, Building2, Warehouse } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PropertyCardProps {
  property: PropertyListing;
  onClick?: () => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  const getTypeIcon = (type: PropertyType) => {
    switch (type) {
      case PropertyType.House:
        return <Home className="w-4 h-4" />;
      case PropertyType.Apartment:
        return <Building2 className="w-4 h-4" />;
      case PropertyType.Commercial:
        return <Warehouse className="w-4 h-4" />;
      default:
        return <Home className="w-4 h-4" />;
    }
  };

  return (
    <Card
      className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 py-0 pb-6"
      onClick={onClick}
    >
      <div className="relative">
        <ImageCarousel
          images={property.image || []}
          alt={property.title}
          aspectRatio={4 / 3}
          fallbackIcon={<Home className="w-12 h-12 text-gray-400" />}
          showNavigation={false}
          hoverEffect={false}
        />

        <StatusBadge
          status={property.status}
          className="absolute top-3 left-3 z-10"
        />

        <PriceBadge
          price={property.price}
          status={property.status}
          className="absolute top-3 right-3 z-10"
        />
      </div>
      <div className="px-4 space-y-3">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
          {property.title}
        </h3>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm truncate">{property.location}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              {getTypeIcon(property.property_type)}
              <span className="capitalize">{property.property_type}</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(property.created_at)}</span>
            </div> */}
          </div>

        {/* <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
          {property.description}
        </p> */}
      </div>
    </Card>
  );
}
