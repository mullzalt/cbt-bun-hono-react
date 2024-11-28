import * as React from "react";

import { InvitationStatus } from "@/shared/schemas/invitation.schema";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function InvitationStatusToggle({
  onChange,
  defaultValue = "pending",
}: {
  onChange?: (value: InvitationStatus) => void;
  defaultValue?: InvitationStatus;
}) {
  const [selected, setSelected] =
    React.useState<InvitationStatus>(defaultValue);
  return (
    <ToggleGroup
      type="single"
      value={selected}
      onValueChange={(v) => {
        const value: InvitationStatus =
          v === "" ? selected : (v as InvitationStatus);
        setSelected(value);
        onChange && onChange(value);
      }}
    >
      <ToggleGroupItem value="pending">Pending</ToggleGroupItem>
      <ToggleGroupItem value="accepted">Accepted</ToggleGroupItem>
      <ToggleGroupItem value="expired">Expired</ToggleGroupItem>
    </ToggleGroup>
  );
}
