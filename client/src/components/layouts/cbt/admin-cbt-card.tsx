import * as React from "react";
import { Link } from "@tanstack/react-router";

import { CbtsResponse } from "@/queries/cbt";
import {
  CalendarIcon,
  Clock3Icon,
  PencilRulerIcon,
  UsersIcon,
} from "lucide-react";
import moment from "moment";

import { CbtStatus } from "@/shared/query/cbt.query.schema";
import { ArrayElement } from "@/shared/types/util";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CbtCardProps {
  data: ArrayElement<CbtsResponse["data"]>;
}

export const CbtStatusBadge: Record<CbtStatus, () => React.ReactNode> = {
  unpublished: () => (
    <Badge
      variant={"outline"}
      className="text-muted-foreground border-muted-foreground"
    >
      Unpublished
    </Badge>
  ),
  published: () => (
    <Badge variant={"outline"} className="text-primary border-primary">
      Published
    </Badge>
  ),
  ongoing: () => (
    <Badge variant={"outline"} className="text-green-600 border-green-600">
      On Going
    </Badge>
  ),
  closed: () => (
    <Badge variant={"outline"} className="text-destructive border-destructive">
      Closed
    </Badge>
  ),
};

function TimeBadge({ time }: { time: string | null }) {
  const timeMoment = React.useMemo(
    () => ({
      date: time ? moment(new Date(time)).format("DD MMM YYYY") : "",
      time: time ? moment(new Date(time)).format("hh:mm") : "",
    }),
    [time],
  );
  return (
    <Badge variant={"outline"}>
      {time ? (
        <div className="flex gap-2 text-xs items-center text-muted-foreground">
          <CalendarIcon className="size-3" /> {timeMoment.date}
          <Clock3Icon className="size-3" /> {timeMoment.time}
        </div>
      ) : (
        <div className="flex gap-2 text-xs items-center text-muted-foreground/80">
          <CalendarIcon className="size-3" /> Not Set
        </div>
      )}
    </Badge>
  );
}

const AdminCbtCard = React.forwardRef<HTMLDivElement, CbtCardProps>(
  ({ data }, ref) => {
    const Status = CbtStatusBadge[data.status];
    const dates = {
      publishedAt:
        data.publishedAt &&
        moment(new Date(data.publishedAt)).format("DD MMM YYYY, hh:mm"),
      openedAt:
        data.openedAt &&
        moment(new Date(data.openedAt)).format("DD MMM YYYY, hh:mm"),
      closedAt:
        data.closedAt &&
        moment(new Date(data.closedAt)).format("DD MMM YYYY, hh:mm"),
    };
    return (
      <Card ref={ref}>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>
              <Link
                to="/admin/cbts/$cbtId"
                params={{
                  cbtId: data.id,
                }}
              >
                {data.name}
              </Link>
            </CardTitle>
            <div>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Status />
                  </div>
                </TooltipTrigger>
                <TooltipContent>CBT Status</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex gap-4 items-center">
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <PencilRulerIcon className="size-4" /> 4
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  Total subject in this CBT Module
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <UsersIcon className="size-4" /> 9
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  Total teacher that assigened to this CBT Module
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Tooltip>
                <TooltipTrigger>
                  <TimeBadge time={data.openedAt} />
                </TooltipTrigger>
                <TooltipContent>
                  Open At <br /> CBT module open schedule where module is
                  accessible to student
                </TooltipContent>
              </Tooltip>
              -
              <Tooltip>
                <TooltipTrigger>
                  <TimeBadge time={data.closedAt} />
                </TooltipTrigger>
                <TooltipContent>
                  Closed At <br /> CBT module open schedule where module is no
                  longer accessible to student
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);

AdminCbtCard.displayName = "AdminCbtCard";

export { AdminCbtCard };
