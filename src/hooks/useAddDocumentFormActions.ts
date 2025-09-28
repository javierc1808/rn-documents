import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { UseFormSetValue } from "react-hook-form";
import { Alert } from "react-native";

import { useCreateDocumentMutation } from "@/src/api/queries/useCreateDocumentMutation";
import { CreateDocumentFormData } from "@/src/schemas/documentSchema";

interface UseAddDocumentFormActionsParams {
  selectedFiles: string[];
  setValue: UseFormSetValue<CreateDocumentFormData>;
  reset: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

interface UseAddDocumentFormActionsReturnType {
  handleFileSelection: () => Promise<void>;
  removeFile: (index: number) => void;
  handleVersionChange: (
    text: string,
    onChange: (value: string) => void,
  ) => void;
  onSubmit: (data: CreateDocumentFormData) => Promise<void>;
  handleClose: () => void;
}

// Function to apply version mask with auto-completion of dots
const _applyVersionMask = (text: string): string => {
  // Remove all characters that are not numbers, dots or commas
  const cleanText = text.replace(/[^0-9.,]/g, "");

  // Replace commas with dots
  const withDots = cleanText.replace(/,/g, ".");

  // Avoid consecutive dots
  const withoutConsecutiveDots = withDots.replace(/\.{2,}/g, ".");

  // Avoid starting with dot
  const withoutStartingDot = withoutConsecutiveDots.replace(/^\./, "");

  // Only allow numbers and dots
  const numbersOnly = withoutStartingDot.replace(/[^0-9.]/g, "");

  // Split by dots and limit to 3 parts (major.minor.patch)
  const parts = numbersOnly.split(".");
  const limitedParts = parts.slice(0, 3);

  // Join back with dots
  return limitedParts.join(".");
};

export const UseAddDocumentFormActions = ({
  selectedFiles,
  setValue,
  reset,
  setIsSubmitting,
}: UseAddDocumentFormActionsParams): UseAddDocumentFormActionsReturnType => {
  const createDocumentMutation = useCreateDocumentMutation();

  const handleFileSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const fileNames = result.assets.map((asset) => asset.name);
        const currentFiles = selectedFiles || [];

        // Filter files that are not already selected to avoid duplicates
        const newFiles = fileNames.filter(
          (fileName) => !currentFiles.includes(fileName),
        );

        if (newFiles.length === 0) {
          Alert.alert("Notice", "Some files are already selected");
          return;
        }

        setValue("files", [...currentFiles, ...newFiles], {
          shouldValidate: true,
        });
      }
    } catch (error) {
      console.error("Error selecting files:", error);
      Alert.alert("Error", "Could not select files");
    }
  };

  const removeFile = (index: number) => {
    const currentFiles = selectedFiles || [];
    const newFiles = currentFiles.filter((_, i) => i !== index);
    setValue("files", newFiles, { shouldValidate: true });
  };

  const handleVersionChange = (
    text: string,
    onChange: (value: string) => void,
  ) => {
    const maskedText = _applyVersionMask(text);
    onChange(maskedText);
  };

  const onSubmit = async (data: CreateDocumentFormData) => {
    setIsSubmitting(true);
    try {
      await createDocumentMutation.mutateAsync({
        name: data.name,
        version: data.version,
        files: data.files.map((file) => {
          const nameParts = file.split(".");
          nameParts.pop();
          return nameParts.join(".");
        }),
      });

      Alert.alert("Success", "Document created successfully", [
        {
          text: "OK",
          onPress: () => {
            reset();
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("Error creating document:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      Alert.alert("Error", `Could not create document: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    router.back();
  };

  return {
    handleFileSelection,
    removeFile,
    handleVersionChange,
    handleClose,
    onSubmit,
  };
};
