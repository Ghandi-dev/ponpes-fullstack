import Image from "next/image";
import React, { ChangeEvent, ReactNode, useEffect, useId, useRef } from "react";
import { Spinner } from "./spinner";
import { Button } from "./button";
import { Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropTypes {
  name: string;
  label?: ReactNode;
  className?: string;
  isDropable?: boolean;
  isUploading?: boolean;
  isDeleting?: boolean;
  preview?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  onUpload?: (files: FileList) => void;
  onDelete?: () => void;
}

const InputFile = (props: PropTypes) => {
  const { name, label, className, isDropable = false, onUpload, onDelete, isDeleting, isUploading, isInvalid, errorMessage, preview } = props;
  const drop = useRef<HTMLLabelElement>(null);
  const dropZoneId = useId();

  const handleDragOver = (e: DragEvent) => {
    if (isDropable) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && onUpload) {
      onUpload(files);
    }
  };

  useEffect(() => {
    const dropCurrent = drop.current;
    if (dropCurrent) {
      dropCurrent.addEventListener("dragover", handleDragOver);
      dropCurrent.addEventListener("drop", handleDrop);
      return () => {
        dropCurrent.removeEventListener("dragover", handleDragOver);
        dropCurrent.removeEventListener("drop", handleDrop);
      };
    }
  }, []);

  const handleOnUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && onUpload) {
      onUpload(files);
    }
  };

  return (
    <div>
      {label}
      <label
        ref={drop}
        htmlFor={`dropzone-file-${dropZoneId}`}
        className={cn(
          "flex min-h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-100",
          className,
          { "border-danger-500": isInvalid }
        )}
      >
        {preview && (
          <div className="relative flex flex-col items-center justify-center gap-2 p-5">
            <div className="mb-2 w-1/2">
              <Image fill src={preview} alt="file" className="!relative" />
            </div>
            <Button
              onClick={onDelete}
              disabled={isDeleting}
              className="justify-cente absolute right-2 top-2 flex h-9 w-9 items-center rounded bg-red-700 hover:bg-red-300"
            >
              {isDeleting ? <Spinner /> : <Trash2 className="h-5 w-5 text-danger-500" />}
            </Button>
          </div>
        )}
        {!preview && !isUploading && (
          <div className="flex flex-col items-center justify-center gap-2 p-5">
            <Upload className="mb-2 h-10 w-10 text-gray-400" />
            <p className="text-center text-sm font-semibold text-gray-500">{isDropable ? "Drop or click to upload" : "Click to upload"}</p>
          </div>
        )}
        {isUploading && (
          <div className="flex flex-col items-center justify-center gap-2 p-5">
            <Spinner />
            <p className="text-center text-sm font-semibold text-gray-500">Uploading...</p>
          </div>
        )}
        <input
          name={name}
          type="file"
          className="hidden"
          accept="image/*"
          id={`dropzone-file-${dropZoneId}`}
          onChange={handleOnUpload}
          disabled={preview !== "" || isUploading || isDeleting}
          onClick={(e) => {
            e.currentTarget.value = "";
            e.target.dispatchEvent(new Event("change", { bubbles: true }));
          }}
        />
      </label>
      {isInvalid && <p className="p-1 text-xs text-danger-500">{errorMessage}</p>}
    </div>
  );
};

export default InputFile;
