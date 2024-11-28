"use client";

import * as React from "react";

import { FilterIcon } from "lucide-react";

import { CbtStatus } from "@/shared/query/cbt.query.schema";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CbtStatusOptionsProps {
  value?: CbtStatus;
  onChange?: (status: CbtStatus) => void;
}

export function CbtStatusOptions({
  value = "unpublished",
  onChange,
}: CbtStatusOptionsProps) {
  const [status, setStatus] = React.useState<CbtStatus>(value);

  const handleChange = (val: string) => {
    setStatus(val as CbtStatus);
    onChange && onChange(val as CbtStatus);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <FilterIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={status} onValueChange={handleChange}>
          <DropdownMenuRadioItem value="unpublished">
            Unpublished
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="published">
            Published
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ongoing">
            On-going
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="closed">Closed</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
