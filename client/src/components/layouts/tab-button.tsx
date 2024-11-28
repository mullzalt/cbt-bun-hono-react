import * as React from "react";

import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

export interface TabContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const TabButtonContainer = React.forwardRef<HTMLDivElement, TabContainerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "p-1 bg-muted w-full flex items-center gap-2 rounded-lg overflow-auto",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
TabButtonContainer.displayName = "TabButtonContainer";

export interface TabButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isActive?: boolean;
}

const TabButton = React.forwardRef<HTMLButtonElement, TabButton>(
  ({ className, isActive = false, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          "h-9 px-4 py-2 text-muted-foreground gap-2 bg-muted w-full",
          isActive && "bg-background text-primary cursor-default",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
TabButton.displayName = "TabButton";

export { TabButton, TabButtonContainer  };
