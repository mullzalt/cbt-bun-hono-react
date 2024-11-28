import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";

import { useCreateSubject } from "@/queries/mutations/use-subject-mutation";
import { PlusIcon } from "lucide-react";

import {
  createCbtSubjectSchema,
  updateCbtSubjectSchema,
} from "@/shared/schemas/cbt-subject.schema";
import { Input } from "@/components/ui/input";
import { ButtonExtra } from "@/components/button-extra";

import { WithTooltip } from "../tootip-component";

interface SubjectRowProps extends React.HTMLAttributes<HTMLDivElement> {}

const SubjectForm = React.forwardRef<HTMLDivElement, SubjectRowProps>(
  ({ className, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const { mutateAsync } = useCreateSubject();

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
        inputRef.current?.focus();
      },
      onSubmit: async ({ value, formApi }) => {
        await mutateAsync(
          {
            json: value,
          },
          {
            onSuccess: () => {
              formApi.reset();
              inputRef.current?.focus();
            },
          },
        );
      },
    });

    return (
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

          <Subscribe
            selector={(state) => [state.isSubmitting, state.canSubmit]}
          >
            {([isSubmitting, canSubmit]) => (
              <WithTooltip tooltip="Add Subject">
                <ButtonExtra
                  type="submit"
                  size={"icon"}
                  isLoading={isSubmitting}
                  disabled={!canSubmit}
                >
                  <PlusIcon />
                </ButtonExtra>
              </WithTooltip>
            )}
          </Subscribe>
        </div>
      </form>
    );
  },
);

SubjectForm.displayName = "SubjectForm";

export { SubjectForm };
