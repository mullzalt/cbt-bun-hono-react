import { z } from "zod";
import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";
import { zodValidator } from "@tanstack/zod-form-adapter";

import { upsertProfile } from "@/queries/auth";
import { toast } from "sonner";

import {
  UpsertProfile,
  upsertProfileSchema,
} from "@/shared/schemas/profile.schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ButtonExtra } from "@/components/button-extra";
import { FieldInfo } from "@/components/form/field-info";

const searchSchema = z.object({
  redirect: fallback(z.string(), "/dashboard").default("/dashboard"),
});

export const Route = createFileRoute("/profile/new-user")({
  component: Component,
  validateSearch: zodSearchValidator(searchSchema),
  beforeLoad: async ({ context, search }) => {
    const states = context.session.states;

    if (states && !states.shouldFillProfile) {
      throw redirect({ to: search.redirect });
    }
  },
});

function Component() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: upsertProfile,
  });

  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {} as UpsertProfile,
    validatorAdapter: zodValidator(),
    validators: {
      onChange: upsertProfileSchema,
    },
    onSubmit: ({ value, formApi }) => {
      mutateAsync(
        { form: value },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({
              queryKey: ["auth", "user"],
              exact: true,
              refetchType: "all",
            });
            router.invalidate();
            await navigate({ to: search.redirect });
            return;
          },
          onError: (error) => {
            formApi.setErrorMap({
              onSubmit: error.message,
            });
            toast.error("Failed to create profile: " + error.message);
          },
        },
      );
    },
  });
  return (
    <div className="flex flex-col min-h-screen container p-2 md:p-4 justify-center items-center">
      <Card>
        <CardContent>
          <CardHeader className="text-center">
            <CardTitle>Welcome to Twittor Academy</CardTitle>
            <CardDescription>
              Please fill the form below before continue
            </CardDescription>
          </CardHeader>
          <div className="grid gap-4 sm:w-[550px]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit();
              }}
            >
              <div className="grid gap-4">
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

                <Separator />

                <Field
                  name="name"
                  children={(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor={field.name}>Name</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <div className="text-xs">
                        <FieldInfo field={field} />
                      </div>
                    </div>
                  )}
                />
                <Field
                  name="phoneNumber"
                  children={(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor={field.name}>
                        Phone Number{" "}
                        <span className="text-muted-foreground italic">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <div className="text-xs">
                        <FieldInfo field={field} />
                      </div>
                    </div>
                  )}
                />

                <Subscribe
                  selector={(state) => [state.isSubmitting, state.canSubmit]}
                  children={([isSubmitting, canSubmit]) => (
                    <ButtonExtra
                      type="submit"
                      className="w-full"
                      disabled={!canSubmit}
                      isLoading={isSubmitting}
                    >
                      Submit
                    </ButtonExtra>
                  )}
                />
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
