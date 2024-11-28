import * as React from "react";

import "@/components/minimal-tiptap/styles/index.css";

import type { Content, Editor } from "@tiptap/react";
import { BubbleMenu, EditorContent } from "@tiptap/react";

import { cn } from "@/lib/utils";
import { LinkBubbleMenu } from "@/components/minimal-tiptap/components/bubble-menu/link-bubble-menu";
import { SectionTwo } from "@/components/minimal-tiptap/components/section/two";
import type { UseMinimalTiptapEditorProps } from "@/components/minimal-tiptap/hooks/use-minimal-tiptap";
import { useMinimalTiptapEditor } from "@/components/minimal-tiptap/hooks/use-minimal-tiptap";

import { MeasuredContainer } from "../minimal-tiptap/components/measured-container";
import SectionFour from "../minimal-tiptap/components/section/four";
import { Separator } from "./separator";

export interface MinimalTiptapProps
  extends Omit<UseMinimalTiptapEditorProps, "onUpdate"> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
}

const Toolbar = ({ editor }: { editor: Editor }) => {
  return (
    <div className={cn("shrink-0 overflow-x-auto border-t border-border p-2 bg-background rounded-lg shadow-xl z-50")}>
      <div className="flex w-max items-center gap-px">
        <SectionTwo
          editor={editor}
          activeActions={["bold", "italic", "underline", "strikethrough"]}
          mainActionCount={5}
        />
        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionFour
          editor={editor}
          activeActions={["bulletList", "orderedList"]}
          mainActionCount={2}
          variant="outline"
        />
      </div>
    </div>
  );
};

export const RichTextEditor = React.forwardRef<
  HTMLDivElement,
  MinimalTiptapProps
>(({ value, onChange, className, editorContentClassName, ...props }, ref) => {
  const editor = useMinimalTiptapEditor({
    value,
    onUpdate: onChange,
    ...props,
  });

  if (!editor) {
    return null;
  }

  React.useEffect(() => {
    if(!value) return
    editor.commands.setContent(value)
    return () => {}
  }, [value])

  return (
    <MeasuredContainer
      as="div"
      name="editor"
      ref={ref}
      className={cn(
        "flex w-full flex-col rounded-md  focus-within:shadow-sm focus-within:bg-muted focus-within:border-primary",
        className,
      )}
    >
      <EditorContent
        editor={editor}
        className={cn("minimal-tiptap-editor p-2", editorContentClassName)}
      />
      <BubbleMenu editor={editor}><Toolbar editor={editor}/></BubbleMenu>
      <LinkBubbleMenu editor={editor} />
    </MeasuredContainer>
  );
});

RichTextEditor.displayName = "RichTextEditor";
