"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, Loader2 } from "lucide-react";
import { logout } from "@/app/actions/actions";

interface NavigationItem {
  item: string;
  route: string;
}

interface NavigationDrawerProps {
  items: NavigationItem[];
  title?: string;
  triggerClassName?: string;
  showLogout?: boolean;
}

export default function NavigationDrawer({
  items,
  title = "Navigation",
  triggerClassName,
  showLogout = true,
}: NavigationDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleItemClick = (route: string) => {
    router.push(route);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
      // Close drawer even if logout fails
      setIsOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Drawer open={isOpen} direction="left" onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-10 w-10 p-0 hover:bg-accent hover:text-accent-foreground",
            triggerClassName
          )}
          aria-label="Toggle navigation menu"
        >
          <span className="sr-only">Toggle menu</span>☰
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className={cn(
          "h-full fixed left-0 top-0 bg-sidebar border-r border-sidebar-border",
          "w-80 sm:w-80 lg:w-80"
        )}
      >
        <DrawerHeader>
          <DrawerTitle className="text-center">{title}</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-2 p-4 flex-1">
          {items.map((navItem, index) => (
            <Button
              key={index}
              variant="ghost"
              className="justify-start h-12 text-left font-normal"
              onClick={() => handleItemClick(navItem.route)}
            >
              {navItem.item}
            </Button>
          ))}
        </div>

        {/* Logout button at the bottom */}
        {showLogout && (
          <div className="p-4 border-t border-border">
            <Button
              variant="destructive"
              className="w-full justify-start h-12 text-left font-normal"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </>
              )}
            </Button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
