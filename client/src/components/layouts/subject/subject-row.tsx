import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";

import { useDeleteSubject, useUpdateSubject } from "@/queries/mutations/use-subject-mutation";
import { SubjectData } from "@/queries/subject";
import { CheckIcon, PenIcon, TrashIcon } from "lucide-react";

import { updateCbtSubjectSchema } from "@/shared/schemas/cbt-subject.schema";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ButtonExtra } from "@/components/button-extra";

import { WithConfirm } from "../confirm-dialog";
import { WithTooltip } from "../tootip-component";

interface SubjectRowProps extends React.HTMLAttributes<HTMLDivElement> {
  data: SubjectData;
}

const SubjectRow = React.forwardRef<HTMLDivElement, SubjectRowProps>(
  ({ data, className, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = React.useState(false);

    const { mutateAsync } = useUpdateSubject();

    const { mutateAsync: deleteSubject} = useDeleteSubject()

    const { Field, Subscribe, handleSubmit } = useForm({
      defaultValues: {
        name: data.name,
      },
      validatorAdapter: zodValidator(),
      validators: {
        onSubmit: updateCbtSubjectSchema,
      },
      onSubmitInvalid: ({ formApi }) => {
        formApi.reset();
        inputRef.current?.blur();
        setIsEditing(false);
      },
      onSubmit: async ({ value }) => {
        if (value.name === data.name) {
          inputRef.current?.blur();
          setIsEditing(false);
          return;
        }
        await mutateAsync(
          {
            param: { subjectId: data.id },
            json: value,
          },
          {
            onSuccess: () => {
              inputRef.current?.blur();
              setIsEditing(false);
            },
          },
        );
      },
    });

    const handleToggleEdit = React.useCallback(() => {
      setIsEditing(true);
      inputRef.current?.select();
    }, [isEditing]);

    return (
      <Card className={className} ref={ref} {...props}>
        <CardHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
          >
            <div className="flex flex-row items-center gap-2">
              <Field name="name">
                {(field) => (
                  <Input
                    readOnly={!isEditing}
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    autoComplete="off"
                    onChange={(e) => field.handleChange(e.target.value)}
                    ref={inputRef}
                  />
                )}
              </Field>

              {isEditing ? (
                <Subscribe
                  selector={(state) => [state.isSubmitting, state.canSubmit]}
                >
                  {([isSubmitting, canSubmit]) => (
                    <WithTooltip tooltip="Save">
                      <ButtonExtra
                        type="submit"
                        size={"icon"}
                        isLoading={isSubmitting}
                        disabled={!canSubmit}
                      >
                        <CheckIcon />
                      </ButtonExtra>
                    </WithTooltip>
                  )}
                </Subscribe>
              ) : (
                <WithTooltip tooltip="Edit">
                  <ButtonExtra
                    size={"icon"}
                    type="button"
                    onClick={handleToggleEdit}
                    variant={"outline"}
                  >
                    <PenIcon />
                  </ButtonExtra>
                </WithTooltip>
              )}
                <WithConfirm
                  title="Are you sure?"
                  description={`Subject "${data.name}" will be deleted and cannot be undone.
This won't effect the already existing module that used it.`}
                  onConfirm={async() => await deleteSubject({param: {subjectId: data.id}})}
                >
              <WithTooltip tooltip="Delete subject">
                  <ButtonExtra
                    size={"icon"}
                    type="button"
                    variant={"destructive"}
                    disabled={isEditing}
                  >
                    <TrashIcon />
                  </ButtonExtra>
              </WithTooltip>
                </WithConfirm>
            </div>
          </form>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {data.modulesCount
              ? `Used by ${data.modulesCount} module(s)`
              : "Not use by any module"}
          </div>
        </CardContent>
      </Card>
    );
  },
);

SubjectRow.displayName = "SubjectRow";

export { SubjectRow };
