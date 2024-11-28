import * as React from "react";

interface DbFile {
  name: string;
  mimeType: string;
  url: string;
}
interface UseUploadOptions {
  defaultValue?: DbFile | null;
  onUpload?: (file: File | undefined) => void;
  onFileChange?: (file: File | undefined) => void;
}

async function urlToFile({ url, mimeType, name }: DbFile) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], name, { type: mimeType });
}

export function useUpload({
  defaultValue,
  onFileChange,
  onUpload,
}: UseUploadOptions = {}) {
  const [file, setFile] = React.useState<File>();
  const [url, setUrl] = React.useState<string>();

  React.useEffect(() => {
    if (!defaultValue) return;
    urlToFile(defaultValue).then((f) => {
      setFile(f);
    });
  }, [defaultValue]);

  React.useEffect(() => {
    const src = file ? URL.createObjectURL(file) : "";
    setUrl(src);
    onFileChange && onFileChange(file);
  }, [file]);

  const handleUpload = React.useCallback(() => {
    onUpload && onUpload(file);
  }, [file]);

  return {
    handleUpload,
    file,
    setFile,
    url,
  };
}
