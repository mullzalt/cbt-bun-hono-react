import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";

import { useCreateInvitation } from "@/queries/mutations/use-invitation-mutation";
import { PlusIcon } from "lucide-react";

import { insertUsersSchema, UserRole } from "@/shared/schemas/user.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ButtonExtra } from "@/components/button-extra";

export function InvitationForm() {
  const { mutateAsync } = useCreateInvitation();

  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: { role: "student" } as { role: UserRole },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: insertUsersSchema.pick({ role: true }),
    },
    onSubmit: ({ value }) => {
      mutateAsync({ form: value });
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <PlusIcon /> New Invitation
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
          }}
        >
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Create Invitation</h4>
              <p className="text-sm text-muted-foreground">
                Send a new invitation link for user
              </p>
            </div>
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
                name="role"
                children={(field) => (
                  <div className="flex items-center gap-2">
                    <Label htmlFor={field.name}>Role</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as UserRole)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
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
                    Save
                  </ButtonExtra>
                )}
              />
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
