import * as React from "react";

import { CbtQuestion } from "@/queries/cbt-question";
import {
  useCreateOption,
  useDeleteOption,
  useUpdateOption,
} from "@/queries/mutations/use-option-mutation";
import { useSetAnswer } from "@/queries/mutations/use-question-mutation";
import { Content } from "@tiptap/react";
import {  ImageUpIcon, PlusIcon, XIcon } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { QuestionForm } from "@/shared/schemas/cbt-module-question.schema";
import { ArrayElement } from "@/shared/types/util";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

import { ButtonExtra } from "../button-extra";
import {
  ImagePreview,
  UploadButton,
} from "../file-uploader/file-uploader-dialog";
import { ListComponent } from "../layouts/list-component";
import { WithTooltip } from "../layouts/tootip-component";
import { Button } from "../ui/button";
import { RichTextEditor } from "../ui/editor";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

type CbtOptions = CbtQuestion["options"];

type QuestionAnswer = CbtQuestion["answers"];

type OptionValue = Omit<QuestionForm, "text"> & {
  text?: Content;
  url?: string;
};

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

function OptionInput(
  props: ArrayElement<CbtOptions> & {
    cbtId: string;
    cbtModuleId: string;
    questionId: string;
    answers: QuestionAnswer;
  },
) {
  const {
    text = "",
    id,
    cbtId,
    cbtModuleId,
    questionId,
    picture,
    answers,
  } = props;

  const [isMouseEnter, setMouseEnter] = React.useState(false);

  const defaultValue = React.useMemo(
    (): OptionValue => ({
      text: parseContent(text),
      url: picture?.file?.url,
    }),
    [props],
  );

  const { mutate: setAnswer } = useSetAnswer({
    cbtId,
    cbtModuleId,
    questionId,
  });

  const isAnswer = React.useMemo(
    (): boolean => answers.map(({ answerId }) => answerId).includes(id),
    [answers],
  );

  const { mutate, isPending } = useUpdateOption({
    cbtId,
    cbtModuleId,
    questionId,
  });
  const { mutate: deleteOption, isPending: isDeleting } = useDeleteOption({
    cbtId,
    cbtModuleId,
    questionId,
  });
  const [option, setOption] = React.useState<OptionValue>(defaultValue);

  const handleTextChange = useDebouncedCallback((value: Content) => {
    setOption((prev) => ({ ...prev, text: value }));
    const _value = { ...option, text: JSON.stringify(value) };
    mutate({ optionId: id, value: _value });
  }, 2000);

  const handleUpload = React.useCallback(
    (files: File[], setOpen: (isOpen: boolean) => void) => {
      const _value = {
        ...option,
        text: JSON.stringify(option.text),
        file: files[0],
      };
      mutate(
        { optionId: id, value: _value },
        {
          onSuccess: (res) => {
            const dataIndex = res.data.map((d) => d.id).indexOf(id);
            const data = res.data[dataIndex];
            setOpen(false);
            setOption((prev) => ({ ...prev, url: data?.picture?.file?.url }));
          },
        },
      );
    },
    [option],
  );

  const handleDeleteImage = React.useCallback(() => {
    setOption((prev) => ({ ...prev, file: undefined }));
    const _value = {
      ...option,
      text: JSON.stringify(option.text),
      file: "",
    };
    mutate(
      { optionId: id, value: _value },
      {
        onSuccess: () => setOption((prev) => ({ ...prev, url: undefined })),
      },
    );
  }, [option]);

  const handleDeleteOption = React.useCallback(() => {
    if (!id) return;
    deleteOption(id);
  }, [id]);

  React.useEffect(() => {
    setOption({
      text: parseContent(text),
      url: picture?.file?.url,
    });
  }, [id, text, picture]);

  return (
    <div
      className={cn("grid gap-2 flex-1")}
      onMouseEnter={() => setMouseEnter(true)}
      onMouseLeave={() => setMouseEnter(false)}
    >
      <div
        className={cn(
          "flex gap-2 items-center pb-1 border-b border-transparent focus-within:border-primary",
          isMouseEnter && "border-primary",
        )}
      >
        <WithTooltip tooltip="Mark as answer">
          <Checkbox checked={isAnswer} onCheckedChange={() => setAnswer(id)} />
        </WithTooltip>

        <RichTextEditor
          value={option.text}
          output="json"
          onChange={handleTextChange}
          placeholder="type option..."
        />
        {!option.url && isMouseEnter && (
          <WithTooltip tooltip="Upload image">
            <UploadButton onUpload={handleUpload} isUploading={isPending}>
              <Button variant={"outline"} size={"icon"}>
                <ImageUpIcon />
              </Button>
            </UploadButton>
          </WithTooltip>
        )}
        <WithTooltip tooltip="Remove options">
          <ButtonExtra
            variant={"ghost"}
            size={"icon"}
            onClick={handleDeleteOption}
          >
            <XIcon />
          </ButtonExtra>
        </WithTooltip>
      </div>
      <div className="px-8">
        {option.url && (
          <ImagePreview
            size="sm"
            url={option.url}
            onDelete={handleDeleteImage}
            onUpload={handleUpload}
            isUploading={isPending}
          />
        )}
      </div>
    </div>
  );
}

export function OptionsForm({
  options,
  answers,
  cbtId,
  cbtModuleId,
  questionId,
}: {
  options: CbtOptions;
  cbtId: string;
  cbtModuleId: string;
  answers: QuestionAnswer;
  questionId: string;
}) {
  const { mutate: addOption, isPending } = useCreateOption({
    cbtId,
    cbtModuleId,
    questionId,
  });

  const { mutate: setAnswer } = useSetAnswer({
    cbtId,
    cbtModuleId,
    questionId,
  });

  const defaultAnswer = React.useMemo<string | undefined>(
    () => answers[0]?.answerId,
    [answers],
  );

  return (
    <div className="my-8 grid gap-4">
      {options.length && !defaultAnswer ? (
        <div className="italic text-destructive font-semibold">
          Please choose an answer
        </div>
      ) : null}
      <ListComponent
        data={options}
        render={(option) => (
          <OptionInput
            {...option}
            answers={answers}
            cbtId={cbtId}
            cbtModuleId={cbtModuleId}
            questionId={questionId}
          />
        )}
      />
      {options.length < 4 ? (
        <ButtonExtra
          variant="outline"
          size="sm"
          isLoading={isPending}
          onClick={() => addOption({})}
        >
          <PlusIcon /> Add option
        </ButtonExtra>
      ) : null}
    </div>
  );
}
