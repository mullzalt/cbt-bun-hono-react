import { createFileRoute } from "@tanstack/react-router";

import { cbtQueryOption } from "@/queries/cbt";
import { SettingNameForm, SettingDescriptionForm } from "@/components/layouts/cbt/cbt-setting-form";

export const Route = createFileRoute(
  "/_authenticated/admin/cbts/$cbtId/_withNavbar/setting",
)({
  component: Component,
  loader: async ({ params: { cbtId }, context }) => {
    const cbt = await context.queryClient.ensureQueryData(
      cbtQueryOption(cbtId),
    );

    return { cbt: cbt.data };
  },
  meta: ({ loaderData: { cbt } }) => [
    {
      title: cbt.name,
    },
  ],
});

function Component() {
  const { cbt } = Route.useLoaderData();

  return (
    <div className="grid lg:w-[800px] flex-col items-center gap-6 my-4">
      <div className="grid gap-2 border-b pb-2">
        <h2 className="scroll-m-20 font-medium text-2xl tracking-tight">
          General
        </h2>
        <p className="text-muted-foreground">
          Manage how other see this CBT Module
        </p>
      </div>

      <SettingNameForm data={cbt} />
      <SettingDescriptionForm data={cbt} />

      <div className="grid gap-2 border-b pb-2">
        <h2 className="scroll-m-20 font-medium text-2xl tracking-tight">
          Access
        </h2>
        <p className="text-muted-foreground">
          Manage how student can access this module
        </p>
      </div>

      {/* <SettingDateTimeForm data={cbt} /> */}
      {/* <SettingPublishForm data={cbt} /> */}

      <div className="grid gap-2 border-b pb-2">
        <h2 className="scroll-m-20 font-medium text-2xl tracking-tight">
          Danger Zone
        </h2>
      </div>

      <div className="p-4 grid gap-2 border border-destructive rounded-lg">
        <div className="flex items-center justify-between">
          <div className="grid gap-2">
            {/* <Label className="font-semibold">Delete this module</Label> */}
            <p className="text-sm text-muted-foreground"></p>
          </div>
          {/* <ConfirmDialogWithInput */}
          {/*   title="Are you sure want to delete this CBT?" */}
          {/*   message={`CBT "${cbt.name}" will be removed and can no longer be accessed`} */}
          {/*   matchValue={cbt.name} */}
          {/*   renderConfirm={(canSubmit) => ( */}
          {/*     <ButtonExtra */}
          {/*       disabled={!canSubmit} */}
          {/*       onClick={async () => await mutateAsync()} */}
          {/*     > */}
          {/*       Delete */}
          {/*     </ButtonExtra> */}
          {/*   )} */}
          {/* > */}
          {/*   <Button variant="destructive">Delete this module</Button> */}
          {/* </ConfirmDialogWithInput> */}
        </div>
      </div>
    </div>
  );
}
