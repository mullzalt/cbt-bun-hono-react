import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { VariantProps } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

import { buttonVariants } from "./ui/button";

export interface ButtonExtraProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const ButtonExtra = React.forwardRef<HTMLButtonElement, ButtonExtraProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : children}
      </Comp>
    );
  },
);
ButtonExtra.displayName = "ButtonExtra";

export { ButtonExtra };
