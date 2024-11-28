import * as React from "react";

import { CbtQuestion } from "@/queries/cbt-question";
import {
  useDeleteQuestion,
  useUpdateQuestion,
} from "@/queries/mutations/use-question-mutation";
import { Content } from "@tiptap/react";
import { ImageUpIcon, TrashIcon } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { QuestionForm as CreateModuleQuestion } from "@/shared/schemas/cbt-module-question.schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/editor";
import {
  ImagePreview,
  UploadButton,
} from "@/components/file-uploader/file-uploader-dialog";
import { WithTooltip } from "@/components/layouts/tootip-component";

import { ButtonExtra } from "../button-extra";
import { Separator } from "../ui/separator";
import { OptionsForm } from "./option-form";

function parseContent(content: Content) {
  try {
    if (typeof content === "string") {
      content = JSON.parse(content);
    }
    return content;
  } catch {
    return content;
  }
}

type QuestionValue = Omit<CreateModuleQuestion, "text"> & {
  text?: Content;
  url?: string;
};

export function QuestionForm(
  props: CbtQuestion & {
    cbtId: string;
    cbtModuleId: string;
    autoFocus?: boolean;
  },
) {
  const {
    text = "",
    autoFocus = false,
    id,
    cbtId,
    options = [],
    cbtModuleId,
    picture,
    answers = [],
  } = props;

  const defaultValue = React.useMemo(
    (): QuestionValue => ({
      text: parseContent(text),
      url: picture?.file?.url,
    }),
    [props],
  );

  const [isMouseEnter, setMouseEnter] = React.useState(false);

  const { mutate, isPending } = useUpdateQuestion({ cbtId, cbtModuleId });
  const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteQuestion({
    cbtId,
    cbtModuleId,
  });
  const [question, setQuestion] = React.useState<QuestionValue>(defaultValue);

  const handleTextChange = useDebouncedCallback((value: Content) => {
    setQuestion((prev) => ({ ...prev, text: value }));
    const _value = { ...question, text: JSON.stringify(value) };
    mutate({ questionId: id, value: _value });
  }, 2000);

  const handleUpload = React.useCallback(
    (files: File[], setOpen: (isOpen: boolean) => void) => {
      const _value = {
        ...question,
        text: JSON.stringify(question.text),
        file: files[0],
      };
      mutate(
        { questionId: id, value: _value },
        {
          onSuccess: (res) => {
            const dataIndex = res.data.map((d) => d.id).indexOf(id);
            const data = res.data[dataIndex];
            setOpen(false);
            setQuestion((prev) => ({ ...prev, url: data?.picture?.file?.url }));
          },
        },
      );
    },
    [question],
  );

  const handleDeleteImage = React.useCallback(() => {
    setQuestion((prev) => ({ ...prev, file: undefined }));
    const _value = {
      ...question,
      text: JSON.stringify(question.text),
      file: "",
    };
    mutate(
      { questionId: id, value: _value },
      {
        onSuccess: () => setQuestion((prev) => ({ ...prev, url: undefined })),
      },
    );
  }, [question]);

  const handleDeleteQuestion = React.useCallback(() => {
    if (!id) return;
    deleteQuestion(id);
  }, [id]);

  React.useEffect(() => {
    setQuestion({
      text: parseContent(text),
      url: picture?.file?.url,
    });
  }, [id, text, picture]);

  return (
    <Card>
      <CardContent>
        <div className="grid gap-2 py-4">
          {question.url && (
            <ImagePreview
              url={question.url}
              onDelete={handleDeleteImage}
              onUpload={handleUpload}
              isUploading={isPending}
            />
          )}
          <div
            className="flex gap-2 items-center py-2"
            onMouseEnter={() => setMouseEnter(true)}
            onMouseLeave={() => setMouseEnter(false)}
          >
            <div
              className={cn(
                "flex gap-2 flex-1 items-center pb-1 border-b border-transparent peer focus-within:border-primary",
                isMouseEnter && "border-primary",
              )}
            >
              <RichTextEditor
                value={question.text}
                output="json"
                onChange={handleTextChange}
                placeholder="Add question..."
                autofocus={autoFocus}
              />
              {!question.url && isMouseEnter && (
                <WithTooltip tooltip="Upload image">
                  <UploadButton onUpload={handleUpload} isUploading={isPending}>
                    <Button variant={"outline"} size={"icon"}>
                      <ImageUpIcon />
                    </Button>
                  </UploadButton>
                </WithTooltip>
              )}
            </div>
          </div>
        </div>
        <Separator />
        <OptionsForm
          answers={answers}
          options={options}
          cbtId={cbtId}
          cbtModuleId={cbtModuleId}
          questionId={id}
        />
        <Separator />
        <CardFooter className="flex items-center justify-end p-4">
          <WithTooltip tooltip="Delete Question">
            <ButtonExtra
              variant="destructive"
              isLoading={isDeleting}
              onClick={handleDeleteQuestion}
              size="icon"
            >
              <TrashIcon />
            </ButtonExtra>
          </WithTooltip>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
