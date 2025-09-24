import { zodResolver } from "@hookform/resolvers/zod";
import {
  Control,
  FieldErrors,
  useForm,
  UseFormSetValue,
} from "react-hook-form";

import {
  CreateDocumentFormData,
  createDocumentSchema,
} from "@/src/schemas/documentSchema";

interface UseAddDocumentFormStateReturnType {
  control: Control<CreateDocumentFormData>;
  handleSubmit: (onSubmit: (data: CreateDocumentFormData) => void) => void;
  errors: FieldErrors<CreateDocumentFormData>;
  isValid: boolean;
  setValue: UseFormSetValue<CreateDocumentFormData>;
  reset: () => void;
  selectedFiles: string[];
}

export const UseAddDocumentFormState =
  (): UseAddDocumentFormStateReturnType => {
    const form = useForm<CreateDocumentFormData>({
      resolver: zodResolver(createDocumentSchema),
      mode: "onChange",
      defaultValues: {
        name: "",
        version: "",
        files: [],
      },
    });

    const {
      control,
      handleSubmit,
      formState: { errors, isValid },
      setValue,
      watch,
      reset,
    } = form;

    return {
      control,
      errors,
      isValid,
      setValue,
      reset,
      handleSubmit,
      selectedFiles: watch("files"),
    };
  };
