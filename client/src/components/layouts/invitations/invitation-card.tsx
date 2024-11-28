import * as React from "react";

import { InvitationData } from "@/queries/invitation";
import { useDeleteInvitation } from "@/queries/mutations/use-invitation-mutation";
import { CalendarIcon, Clock3Icon, CopyIcon, TrashIcon } from "lucide-react";
import moment from "moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  EmailIcon,
  EmailShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { toast } from "sonner";

import { InvitationStatus } from "@/shared/schemas/invitation.schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ButtonExtra } from "@/components/button-extra";

import { WithTooltip } from "../tootip-component";

interface InvitationCardProps {
  data: InvitationData;
}

const StatusBadge: Record<InvitationStatus, () => React.ReactNode> = {
  pending: () => (
    <Badge variant={"outline"} className="text-primary border-primary">
      Pending
    </Badge>
  ),
  accepted: () => (
    <Badge variant={"outline"} className="text-green-600 border-green-600">
      Accepted
    </Badge>
  ),
  expired: () => (
    <Badge variant={"outline"} className="text-destructive border-destructive">
      Expired
    </Badge>
  ),
};

const InvitationCard = React.forwardRef<HTMLDivElement, InvitationCardProps>(
  ({ data }, ref) => {
    const StatusComp = StatusBadge[data.status];

    const { mutate, isPending } = useDeleteInvitation();

    const times = React.useMemo(
      () => ({
        sentAt: moment(new Date(data.sentAt)).calendar(),
        expiresAt: moment(new Date(data.expiresAt)).calendar(),
        acceptedAt:
          data.acceptedAt && moment(new Date(data.acceptedAt)).calendar(),
      }),
      [data],
    );
    return (
      <Card ref={ref}>
        <CardContent>
          <div className="flex items-center gap-4 justify-between py-4">
            <StatusComp />
            {data.status === "accepted" ? null : (
              <WithTooltip tooltip="Delete invitation">
                <ButtonExtra
                  size="icon"
                  variant="destructive"
                  isLoading={isPending}
                  onClick={() => mutate({ param: { invitationId: data.id } })}
                >
                  <TrashIcon />
                </ButtonExtra>
              </WithTooltip>
            )}
          </div>
          <div className="grid gap-1 text-sm text-muted-foreground">
            {data.status === "accepted" ? (
              <div>Accepted by: {data?.user?.email}</div>
            ) : null}
            <div>role: {data.role}</div>
            {times.acceptedAt ? (
              <div>Accepted at: {times.acceptedAt}</div>
            ) : (
              <>
                <div>Sent at: {times.sentAt}</div>
                <div>expires: {times.expiresAt}</div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-end">
          {data.status === "pending" ? (
            <div className="flex items-center gap-4">
              <div>Share via:</div>
              <WhatsappShareButton
                title="Invitation to Twittor Academy"
                separator={`


`}
                url={data.url}
              >
                <WhatsappIcon size={36} round />
              </WhatsappShareButton>
              <EmailShareButton
                title="Invitation to Twittor Academy"
                url={data.url}
              >
                <EmailIcon size={36} round />
              </EmailShareButton>

              <CopyToClipboard
                text={data.url}
                onCopy={() => toast("Link copied to clipboard")}
              >
                <Button size="icon" variant="outline" className="rounded-full">
                  <CopyIcon />
                </Button>
              </CopyToClipboard>
            </div>
          ) : null}
        </CardFooter>
      </Card>
    );
  },
);

InvitationCard.displayName = "InvitationCard";

export { InvitationCard };
