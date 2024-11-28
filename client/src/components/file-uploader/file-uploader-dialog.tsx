"use client";

import * as React from "react";

import { ImageIcon, ImageUpIcon, TrashIcon, UploadIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ButtonExtra } from "../button-extra";
import { WithTooltip } from "../layouts/tootip-component";
import { FileUploader } from "./file-uploader";

export function UploadButton({
  onUpload,
  isUploading = false,
  children,
}: {
  onUpload?: (
    item: File[],
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => void;
  isUploading?: boolean;
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  return (
    <Dialog
      onOpenChange={(o) => {
        setIsOpen(o);
        setFiles([]);
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload files</DialogTitle>
          <DialogDescription>
            Drag and drop your files here or click to browse.
          </DialogDescription>
        </DialogHeader>
        <div>
          <FileUploader
            maxSize={2 * 1024 * 1024}
            onValueChange={setFiles}
            multiple={false}
            value={files}
          />
        </div>
        <DialogFooter>
          <ButtonExtra
            variant={"outline"}
            isLoading={isUploading}
            disabled={!files.length}
            onClick={() => {
              onUpload && onUpload(files, setIsOpen);
            }}
          >
            <UploadIcon /> Upload file
          </ButtonExtra>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ImagePreviewProps {
  url?: string;
  onDelete?: () => void;
  onUpload?: (
    files: File[],
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => void;
  size?: "sm" | "lg" | "full";
  isUploading?: boolean;
}

export function ImagePreview({
  url,
  onDelete,
  onUpload,
  isUploading,
  size = "lg",
}: ImagePreviewProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
          <img
            src={url}
            className={cn(
              "w-auto border max-h-96 object-contain justify-self-center",
            size === "lg" && "max-h-64",
            size === "sm" && "max-h-32",
            )}
          />
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
          <DialogDescription></DialogDescription>
          <img src={url} className="w-auto max-h-64 object-contain" />
        </DialogHeader>
        <div></div>
        <DialogFooter>
          <UploadButton onUpload={onUpload} isUploading={isUploading}>
            <Button variant={"outline"}>
              <ImageUpIcon /> Upload new File
            </Button>
          </UploadButton>
          <WithTooltip tooltip={"Delete Image"}>
            <Button
              onClick={() => {
                onDelete && onDelete();
              }}
              variant={"destructive"}
              size={"icon"}
            >
              <TrashIcon />
            </Button>
          </WithTooltip>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
