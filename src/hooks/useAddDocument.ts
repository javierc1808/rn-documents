import { zodResolver } from "@hookform/resolvers/zod";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";

import { useCreateDocumentMutation } from "@/src/api/queries";
import {
  CreateDocumentFormData,
  createDocumentSchema,
} from "@/src/schemas/documentSchema";

// Function to apply version mask with auto-completion of dots
const applyVersionMask = (text: string): string => {

  // Remove all characters that are not numbers, dots or commas
  const cleanText = text.replace(/[^0-9.,]/g, '');

  // Replace commas with dots
  const withDots = cleanText.replace(/,/g, '.');

  // Avoid consecutive dots
  const withoutConsecutiveDots = withDots.replace(/\.{2,}/g, '.');

  // Avoid starting with dot
  const withoutStartingDot = withoutConsecutiveDots.replace(/^\./, '');

  // Only allow numbers and dots
  const numbersOnly = withoutStartingDot.replace(/[^0-9.]/g, '');

  return numbersOnly;
};

export const useAddDocument = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createDocumentMutation = useCreateDocumentMutation();

  const form = useForm<CreateDocumentFormData>({
    resolver: zodResolver(createDocumentSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      version: "",
      files: [],
    },
  });

  const { control, handleSubmit, formState: { errors, isValid }, setValue, watch, reset } = form;
  const selectedFiles = watch("files");

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
        const newFiles = fileNames.filter(fileName =>
          !currentFiles.includes(fileName)
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
      Alert.alert("Error", "Could not create document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    router.back();
  };

  const handleVersionChange = (text: string, onChange: (value: string) => void) => {
    const maskedText = applyVersionMask(text);
    onChange(maskedText);
  };

  return {
    // Form state
    control,
    errors,
    isValid,
    selectedFiles,
    
    // Form actions
    handleSubmit,
    onSubmit,
    handleClose,
    
    // File management
    handleFileSelection,
    removeFile,
    
    // Version mask
    handleVersionChange,
    
    // Loading state
    isSubmitting,
  };
};
