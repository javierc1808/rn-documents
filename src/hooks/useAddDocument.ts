import { useState } from "react";
import { Control, FieldErrors, UseFormSetValue } from "react-hook-form";

import { UseAddDocumentFormActions } from "@/src/hooks/useAddDocumentFormActions";
import { UseAddDocumentFormState } from "@/src/hooks/useAddDocumentFormState";
import { CreateDocumentFormData } from "@/src/schemas/documentSchema";

export interface UseAddDocumentReturnType {
  selectedFiles: string[];
  setValue: UseFormSetValue<CreateDocumentFormData>;
  reset: () => void;
  control: Control<CreateDocumentFormData>;
  errors: FieldErrors<CreateDocumentFormData>;
  isValid: boolean;
  handleSubmit: (onSubmit: (data: CreateDocumentFormData) => void) => void;
  onSubmit: (data: CreateDocumentFormData) => void;
  handleClose: () => void;
  handleFileSelection: () => void;
  removeFile: (index: number) => void;
  handleVersionChange: (
    text: string,
    onChange: (value: string) => void
  ) => void;
  isSubmitting: boolean;
}

export const useAddDocument = (): UseAddDocumentReturnType => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    selectedFiles,
    setValue,
    reset,
    handleSubmit,
    control,
    errors,
    isValid,
  } = UseAddDocumentFormState();
  const {
    handleFileSelection,
    removeFile,
    handleVersionChange,
    handleClose,
    onSubmit,
  } = UseAddDocumentFormActions({
    selectedFiles,
    setValue,
    reset,
    setIsSubmitting,
  });

  return {
    // Form state
    selectedFiles,
    setValue,
    reset,
    control,
    errors,
    isValid,

    // Form actions
    handleSubmit,
    onSubmit,
    handleClose,
    handleFileSelection,
    removeFile,
    handleVersionChange,

    // Loading state
    isSubmitting,
  };
};
