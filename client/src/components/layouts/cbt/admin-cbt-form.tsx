import * as React from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-form-adapter";

import { createCbt } from "@/queries/cbt";
import { useCreateSubject } from "@/queries/mutations/use-subject-mutation";
import { PlusIcon } from "lucide-react";

import {
  createCbtSubjectSchema,
  updateCbtSubjectSchema,
} from "@/shared/schemas/cbt-subject.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ButtonExtra } from "@/components/button-extra";

import { WithTooltip } from "../tootip-component";

interface CbtFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const CbtForm = React.forwardRef<HTMLDivElement, CbtFormProps>(
  ({ className, ...props }, ref) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const navigate = useNavigate();

    const { mutateAsync } = useMutation({
      mutationFn: createCbt,
    });

    const { Field, Subscribe, handleSubmit } = useForm({
      defaultValues: {
        name: "",
      },
      validatorAdapter: zodValidator(),
      validators: {
        onChange: createCbtSubjectSchema,
      },
      onSubmitInvalid: ({ formApi }) => {
        formApi.reset();
      },
      onSubmit: async ({ value, formApi }) => {
        await mutateAsync(
          {
            json: value,
          },
          {
            onSuccess: async (res) => {
              await queryClient.invalidateQueries({
                queryKey: ["cbts"],
                refetchType: "active",
              });
              router.invalidate();
              await navigate({
                to: "/admin/cbts/$cbtId/setting",
                params: { cbtId: res.data.id },
              });
            },
            onError: (error) => {
              formApi.setErrorMap({
                onSubmit: error.message,
              });
            },
          },
        );
      },
    });

    return (
      <Popover>
        <PopoverTrigger asChild>
          <ButtonExtra>
            <PlusIcon /> New Module
          </ButtonExtra>
        </PopoverTrigger>
        <PopoverContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
          >
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Create new CBT</h4>
                <p className="text-sm text-muted-foreground">
                  Add new CBT module
                </p>
              </div>
              <Subscribe
                selector={(state) => [state.errorMap]}
                children={([errorMap]) =>
                  errorMap.onSubmit ? (
                    <em className="text-sm font-medium text-destructive">
                      {errorMap.onSubmit?.toString()}
                    </em>
                  ) : null
                }
              />

              <Field name="name">
                {(field) => (
                  <div className="flex items-center gap-2">
                    <Label htmlFor={field.name}>Name</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      autoComplete="off"
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              </Field>
              <Subscribe
                selector={(state) => [state.isSubmitting, state.canSubmit]}
              >
                {([isSubmitting, canSubmit]) => (
                  <WithTooltip tooltip="Add Subject">
                    <ButtonExtra
                      type="submit"
                      isLoading={isSubmitting}
                      disabled={!canSubmit}
                    >
                      Save
                    </ButtonExtra>
                  </WithTooltip>
                )}
              </Subscribe>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    );
  },
);

CbtForm.displayName = "SubjectForm";

export { CbtForm };
