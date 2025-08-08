"use client";

import { forwardRef } from "react";
import {
  Avatar as UIAvatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallbackClassName?: string;
  onClick?: () => void;
}

const sizeClasses = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
  xl: "h-12 w-12 text-lg",
};

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt = "Avatar",
      fallback = "U",
      size = "md",
      className,
      fallbackClassName,
      onClick,
      ...props
    },
    ref
  ) => {
    const sizeClass = sizeClasses[size];

    return (
      <UIAvatar
        ref={ref}
        className={`${sizeClass}${onClick ? " cursor-pointer" : ""}${
          className ? " " + className : ""
        }`}
        onClick={onClick}
        {...props}
      >
        {src && <AvatarImage src={src} alt={alt} />}
        <AvatarFallback
          className={`bg-blue-500 text-white font-medium${
            fallbackClassName ? " " + fallbackClassName : ""
          }`}
        >
          {fallback}
        </AvatarFallback>
      </UIAvatar>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;
