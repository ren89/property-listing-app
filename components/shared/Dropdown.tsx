"use client";

import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DropdownItemProps {
  label: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

interface DropdownProps {
  children: ReactNode;
  items: DropdownItemProps[];
  align?: "start" | "center" | "end";
  className?: string;
  contentClassName?: string;
}

export default function Dropdown({
  children,
  items,
  align = "end",
  className = "",
  contentClassName = "w-56",
}: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={contentClassName}>
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            disabled={item.disabled}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
