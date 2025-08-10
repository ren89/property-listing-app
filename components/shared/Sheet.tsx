import { useState } from "react";
import {
  Sheet as BaseSheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";
import { Button } from "@/components/shared";

interface CustomSheetProps {
  buttonText?: string;
  side?: "top" | "right" | "bottom" | "left";
  buttonClassName?: string;
  sheetClassName?: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export default function Sheet({
  buttonText = "Open",
  side = "bottom",
  buttonClassName = "bg-primary text-white px-6 py-3 rounded-lg shadow-lg mb-4",
  sheetClassName = "p-6 max-w-md mx-auto",
  title,
  description,
  children,
}: CustomSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <BaseSheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className={buttonClassName} onClick={() => setOpen(true)}>
          {buttonText}
        </Button>
      </SheetTrigger>
      <SheetContent
        side={side}
        className={`${sheetClassName} !right-auto !left-1/2 -translate-x-1/2 w-full max-w-md rounded-t-2xl pb-6`}
      >
        <SheetHeader className="px-0">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </BaseSheet>
  );
}
