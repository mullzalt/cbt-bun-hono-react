import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { cbtQueryOption } from "@/queries/cbt";
import { cbtModuleQueryOption } from "@/queries/cbt-module";
import { cbtQuestionsQueryOption } from "@/queries/cbt-question";
import { useCreateQuestion } from "@/queries/mutations/use-question-mutation";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ButtonExtra } from "@/components/button-extra";
import { QuestionForm } from "@/components/form/question-form";
import { ListComponent } from "@/components/layouts/list-component";
import { WithTooltip } from "@/components/layouts/tootip-component";

export const Route = createFileRoute(
  "/_authenticated/admin/cbts/$cbtId/questions/$cbtModuleId/",
)({
  component: QuestionsComponent,
  loader: async ({ params: { cbtId, cbtModuleId }, context }) => {
    const cbt = await context.queryClient.ensureQueryData(
      cbtQueryOption(cbtId),
    );
    const cbtModule = await context.queryClient.ensureQueryData(
      cbtModuleQueryOption({ cbtId, cbtModuleId }),
    );
    return {
      cbt: cbt.data,
      cbtModule: cbtModule.data,
    };
  },
  meta: ({ loaderData: { cbtModule, cbt } }) => [
    {
      title: `${cbt.name} | ${cbtModule.subject}`,
    },
  ],
});

function QuestionsComponent() {
  const params = Route.useParams();
  const { data } = useSuspenseQuery(
    cbtQuestionsQueryOption({
      cbtId: params.cbtId,
      moduleId: params.cbtModuleId,
    }),
  );

  const { mutateAsync: addQuestion, isPending } = useCreateQuestion(params);

  return (
    <React.Fragment>
      <div className="flex flex-col justify-center items-center bg-muted">
        <div className="grid gap-12 max-w-screen-lg w-full">
          <Separator />
          <ListComponent
            data={data.data}
            render={(question) => (
              <QuestionForm {...question} {...params} />
            )}
            renderOnEmpty={() => (
              <div className="flex-1 flex items-center justify-center text-lg italic text-muted-foreground min-h-64">
                This module is not have any question yet
              </div>
            )}
          />
          <ButtonExtra
            onClick={async () => await addQuestion({})}
            isLoading={isPending}
          >
            <PlusIcon /> Add Question
          </ButtonExtra>
        </div>
      </div>
    </React.Fragment>
  );
}
