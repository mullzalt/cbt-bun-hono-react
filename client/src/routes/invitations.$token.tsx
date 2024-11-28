import { z } from "zod";
import {
  createFileRoute,
  notFound,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";
import { zodValidator } from "@tanstack/zod-form-adapter";

import {
  acceptInvitation,
  getInvitationQueryOptions,
} from "@/queries/invitation";

import { acceptInvitationSchema } from "@/shared/schemas/invitation.schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ButtonExtra } from "@/components/button-extra";
import { FieldInfo } from "@/components/form/field-info";

const searchSchema = z.object({
  redirect: fallback(z.string(), "/dashboard").default("/dashboard"),
});

export const Route = createFileRoute("/invitations/$token")({
  component: Component,
  validateSearch: zodSearchValidator(searchSchema),
  beforeLoad: async ({ context, search, params }) => {
    const { isSignedIn } = context.session;
    const data = await context.queryClient.ensureQueryData(
      getInvitationQueryOptions(params.token),
    );

    if (isSignedIn) {
      throw redirect({ to: search.redirect });
    }

    if (!data.success) {
      throw notFound();
    }
  },
  notFoundComponent: InvalidTokenComponent,
});

function InvalidTokenComponent() {
  return (
<div className="text-lg">aaaa</div>
  )
}

function Component() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { token } = Route.useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: acceptInvitation,
  });

  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: { email: "" } as { email: string },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: acceptInvitationSchema,
    },
    onSubmit: ({ value, formApi }) => {
      mutateAsync(
        { form: value, param: { token } },
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
              Please enter your email to accept this invitation.
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
                        placeholder={"Enter email..."}
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
                      Join Twittor Academy
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
