import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Controller } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAddDocument } from "@/src/hooks/useAddDocument";
import { useTheme } from "@/src/hooks/useTheme";

export default function AddDocumentModal() {
  const theme = useTheme();

  const {
    control,
    errors,
    isValid,
    selectedFiles,
    handleSubmit,
    onSubmit,
    handleClose,
    handleFileSelection,
    removeFile,
    handleVersionChange,
    isSubmitting,
  } = useAddDocument();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Add document</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Document Information Section */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Document informations</Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: theme.colors.card,
                      color: theme.colors.text,
                      borderColor: theme.colors.border
                    },
                    errors.name && { borderColor: theme.colors.error, borderWidth: 2 }
                  ]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Stone IPA"
                  placeholderTextColor={theme.colors.placeholder}
                />
              )}
            />
            {errors.name && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.name.message}</Text>
            )}
          </View>

          {/* Version Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Version</Text>
            <Controller
              control={control}
              name="version"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: theme.colors.card,
                      color: theme.colors.text,
                      borderColor: theme.colors.border
                    },
                    errors.version && { borderColor: theme.colors.error, borderWidth: 2 }
                  ]}
                  value={value}
                  onChangeText={(text) => handleVersionChange(text, onChange)}
                  onBlur={onBlur}
                  placeholder="1.0.0"
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.placeholder}
                />
              )}
            />
            {errors.version && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.version.message}</Text>
            )}
          </View>

          {/* File Upload Section */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>File</Text>
            <TouchableOpacity
              style={[styles.fileButton, { borderColor: theme.colors.primary }]}
              onPress={handleFileSelection}
            >
              <MaterialCommunityIcons
                name="file-document-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={[styles.fileButtonText, { color: theme.colors.primary }]}>Choose file</Text>
            </TouchableOpacity>

            {/* Selected Files List */}
            {selectedFiles && selectedFiles.length > 0 && (
              <View style={styles.selectedFilesContainer}>
                {selectedFiles.map((fileName, index) => (
                  <View key={index} style={[styles.fileItem, { backgroundColor: theme.colors.backgroundTertiary }]}>
                    <Text style={[styles.fileName, { color: theme.colors.text }]} numberOfLines={1}>
                      {fileName}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeFile(index)}
                      style={styles.removeFileButton}
                    >
                      <MaterialCommunityIcons
                        name="close"
                        size={16}
                        color={theme.colors.error}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            {errors.files && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.files.message}</Text>
            )}
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: theme.colors.primary },
              (isSubmitting || !isValid) && { backgroundColor: theme.colors.primaryDisabled },
            ]}
            onPress={() => handleSubmit(onSubmit)}
            disabled={isSubmitting || !isValid}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Creating..." : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  fileButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
  },
  fileButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  selectedFilesContainer: {
    marginTop: 12,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    marginRight: 8,
  },
  removeFileButton: {
    padding: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
