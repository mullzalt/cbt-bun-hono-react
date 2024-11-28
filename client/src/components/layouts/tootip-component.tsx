import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

export function WithTooltip({
  children,
  tooltip,
}: {
  children?: React.ReactNode;
  tooltip?: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="z-50">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

