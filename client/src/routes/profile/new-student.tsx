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

import { createStudentProfile } from "@/queries/auth";
import { toast } from "sonner";

import {
  CreateStudentProfile,
  createStudentProfileSchema,
} from "@/shared/schemas/profile.schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/input-password";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ButtonExtra } from "@/components/button-extra";
import { FieldInfo } from "@/components/form/field-info";

const searchSchema = z.object({
  redirect: fallback(z.string(), "/dashboard").default("/dashboard"),
});

export const Route = createFileRoute("/profile/new-student")({
  component: Component,
  validateSearch: zodSearchValidator(searchSchema),
  beforeLoad: async ({ context, search }) => {
    const states = context.session.states;

    if (states && !states.shouldFillStudentProfile) {
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
    mutationFn: createStudentProfile,
  });

  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {} as CreateStudentProfile,
    validatorAdapter: zodValidator(),
    validators: {
      onChange: createStudentProfileSchema,
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
            <CardTitle>Tell us about yourself</CardTitle>
            <CardDescription>
              To help us improve your learning method and reach your goal please
              fill the form below
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

                <h2 className="font-medium text-lg text-muted-foreground">
                  Personal Information
                </h2>

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
                      <Label htmlFor={field.name}>Phone Number</Label>
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
                  name="parentPhoneNumber"
                  children={(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor={field.name}>
                        Parent/Guardian Phone Number
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
                <Field
                  name="address"
                  children={(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor={field.name}>Address</Label>
                      <Textarea
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

                <Separator />

                <h2 className="font-medium text-lg text-muted-foreground">
                  Academic Information
                </h2>

                <Field
                  name="school"
                  children={(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor={field.name}>School</Label>
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
                  name="grade"
                  children={(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor={field.name}>Grade (1 - 12)</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        type="number"
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          let inputValue = parseInt(e.target.value, 10);

                          // If the input is not a valid number, default to 1
                          if (isNaN(inputValue)) {
                            return 
                          }

                          // Clamp the value between 1 and 12
                          inputValue = Math.min(Math.max(inputValue, 1), 12);

                          field.handleChange(inputValue.toString());
                        }}
                      />
                      <div className="text-xs">
                        <FieldInfo field={field} />
                      </div>
                    </div>
                  )}
                />

                <Field
                  name="targetUniversity"
                  children={(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor={field.name}>Target University</Label>
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
