import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";

import { CbtData } from "@/queries/cbt";
import { useUpdateCbt } from "@/queries/mutations/use-cbt-mutation";
import { PencilLineIcon, SendIcon } from "lucide-react";
import moment from "moment";

import { updateCbtSchema } from "@/shared/schemas/cbt.schema";
import { parseNullable, stringToDatetime } from "@/lib/datetime-parser";
import { parseTipTapContent } from "@/lib/parse-json-content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldInfo } from "@/components/form/field-info";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";

import { ButtonExtra } from "../../button-extra";

export function SettingNameForm({ data }: { data: CbtData }) {
  const { mutateAsync } = useUpdateCbt(data.id);

  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {
      name: data.name,
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: updateCbtSchema,
    },
    onSubmitInvalid: ({ formApi }) => {
      formApi.reset();
    },
    onSubmit: async ({ value, formApi }) => await mutateAsync(value),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit();
      }}
    >
      <Field name="name">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor={field.name} className="font-semibold">
              Name
            </Label>
            <div className="flex item-center gap-2">
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter cbt name..."
                autoComplete="off"
              />
              <Subscribe
                selector={(state) => [
                  state.isSubmitting,
                  state.canSubmit,
                  state.isPristine,
                ]}
                children={([isSubmitting, canSubmit, isPristine]) => (
                  <ButtonExtra
                    type="submit"
                    disabled={!canSubmit || isPristine}
                    isLoading={isSubmitting}
                  >
                    <PencilLineIcon /> Rename
                  </ButtonExtra>
                )}
              />
            </div>
            <div className="text-xs">
              <FieldInfo field={field} />
            </div>
            <p className="text-sm text-muted-foreground">
              The name that will be used for this CBT module
            </p>
          </div>
        )}
      </Field>
    </form>
  );
}

export function SettingDescriptionForm({ data }: { data: CbtData }) {
  const { mutateAsync } = useUpdateCbt(data.id);

  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {
      name: data.name,
      description: data.description,
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: updateCbtSchema,
    },
    onSubmitInvalid: ({ formApi }) => {
      formApi.reset();
    },
    onSubmit: async ({ value }) => await mutateAsync(value),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit();
      }}
    >
      <Field name="description">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor={field.name} className="font-semibold">
              Description
            </Label>
            <div className="text-xs">
              <FieldInfo field={field} />
            </div>
            <p className="text-sm text-muted-foreground">
              General overview of this module
            </p>
            <div className="flex item-center gap-2">
              <MinimalTiptapEditor
                value={parseTipTapContent(field.state.value)}
                output="json"
                onChange={(value) => field.handleChange(JSON.stringify(value))}
              />
            </div>
            <div className="flex items-center justify-end">
              <Subscribe
                selector={(state) => [
                  state.isSubmitting,
                  state.canSubmit,
                  state.isPristine,
                ]}
                children={([isSubmitting, canSubmit, isPristine]) => (
                  <ButtonExtra
                    type="submit"
                    disabled={!canSubmit || isPristine}
                    isLoading={isSubmitting}
                  >
                    <PencilLineIcon /> Update
                  </ButtonExtra>
                )}
              />
            </div>
          </div>
        )}
      </Field>
    </form>
  );
}
