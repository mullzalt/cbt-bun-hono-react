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

import { createPassword } from "@/queries/auth";

import {
  CreatePassword,
  createPasswordSchema,
} from "@/shared/schemas/auth.schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/input-password";
import { Label } from "@/components/ui/label";
import { ButtonExtra } from "@/components/button-extra";
import { FieldInfo } from "@/components/form/field-info";

const searchSchema = z.object({
  redirect: fallback(z.string(), "/dashboard").default("/dashboard"),
});

export const Route = createFileRoute("/profile/create-password")({
  component: Component,
  validateSearch: zodSearchValidator(searchSchema),
  beforeLoad: async ({ context, search }) => {
    const states = context.session.states;

    if (states && !states.shouldFillPassword) {
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
    mutationFn: createPassword,
  });

  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {} as CreatePassword,
    validatorAdapter: zodValidator(),
    validators: {
      onChange: createPasswordSchema,
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

            formApi.setFieldValue("password", () => "");
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
            <CardTitle>Enter your password</CardTitle>
            <CardDescription>
              Before continue to our apps, please create a password for security
              reason.
            </CardDescription>
          </CardHeader>
          <div className="grid gap-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit();
              }}
            >
              <div className="grid gap-2">
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

                <Field
                  name="password"
                  children={(field) => (
                    <div className="grid gap-2">
                      <Label className="sr-only" htmlFor={field.name}>
                        Password
                      </Label>
                      <PasswordInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={"Enter password"}
                      />
                      <div className="text-xs">
                        <FieldInfo field={field} />
                      </div>
                    </div>
                  )}
                />
                <Field
                  name="confirmPassword"
                  children={(field) => (
                    <div className="grid gap-2">
                      <Label className="sr-only" htmlFor={field.name}>
                        Password
                      </Label>
                      <PasswordInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={"Confirm Password"}
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
                      Create Password
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
