import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog"; // Radix UI for dialog-based drawers
import { X } from "lucide-react"; // Optional: Icon for closing
import { cn } from "@/lib/utils"; // Utility function for merging class names

export const Drawer = Dialog.Root;

export const DrawerTrigger = Dialog.Trigger;

export const DrawerContent = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => (
  <Dialog.Portal>
    {/* Overlay (background blur/dark) */}
    <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />

    {/* Drawer container */}
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Content inside the drawer */}
      <Dialog.Content
        ref={ref}
        className={cn(
          "relative h-full w-80 bg-white p-4 shadow-lg",
          className
        )}
        {...props}
      >
        {children}

        {/* Close button */}
        <Dialog.Close asChild>
          <button
            aria-label="Close"
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
          >
            <X className="h-6 w-6" />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </div>
  </Dialog.Portal>
));
DrawerContent.displayName = "DrawerContent";
