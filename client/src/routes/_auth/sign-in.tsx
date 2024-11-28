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

import { signIn, validateSession } from "@/queries/auth";
import { useTranslation } from "react-i18next";

import { SignIn, signInSchema } from "@/shared/schemas/auth.schema";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/input-password";
import { Label } from "@/components/ui/label";
import { ButtonExtra } from "@/components/button-extra";
import { FieldInfo } from "@/components/form/field-info";
import {
  AuthFormWrapper,
  AuthPage,
} from "@/components/layouts/auth/auth-wrapper";

export const Route = createFileRoute("/_auth/sign-in")({
  component: SignInComponent,
});

function SignInComponent() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: signIn,
  });

  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {} as SignIn,
    validatorAdapter: zodValidator(),
    validators: {
      onChange: signInSchema,
    },
    onSubmit: ({ value, formApi }) => {
      mutateAsync(value, {
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
            onSubmit: error.message || t("error.unknown"),
          });

          formApi.setFieldValue("password", () => "");
        },
      });
    },
  });
  const { t } = useTranslation();
  return (
    <AuthPage>
      <AuthFormWrapper
        title={t("auth.sign-in-title")}
        description={t("auth.sign-in-desc")}
        orLabel={t("auth.or-continue")}
      >
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
              name="email"
              children={(field) => (
                <div className="grid gap-2">
                  <Label className="sr-only" htmlFor={field.name}>
                    Email
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t("auth.sign-in-email-placeholder")}
                  />
                  <div className="text-xs">
                    <FieldInfo field={field} />
                  </div>
                </div>
              )}
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
                    placeholder={t("auth.sign-in-password-placeholder")}
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
                  {t("auth.sign-in-button")}
                </ButtonExtra>
              )}
            />
          </div>
        </form>
      </AuthFormWrapper>
    </AuthPage>
  );
}
