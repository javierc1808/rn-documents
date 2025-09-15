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

export default function AddDocumentModal() {
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add document</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Document Information Section */}
          <Text style={styles.sectionTitle}>Document informations</Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Stone IPA"
                  placeholderTextColor="#999"
                />
              )}
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name.message}</Text>
            )}
          </View>

          {/* Version Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Version</Text>
            <Controller
              control={control}
              name="version"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.version && styles.inputError]}
                  value={value}
                  onChangeText={(text) => handleVersionChange(text, onChange)}
                  onBlur={onBlur}
                  placeholder="1.0.0"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              )}
            />
            {errors.version && (
              <Text style={styles.errorText}>{errors.version.message}</Text>
            )}
          </View>

          {/* File Upload Section */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>File</Text>
            <TouchableOpacity
              style={styles.fileButton}
              onPress={handleFileSelection}
            >
              <MaterialCommunityIcons
                name="file-document-outline"
                size={20}
                color="#007AFF"
              />
              <Text style={styles.fileButtonText}>Choose file</Text>
            </TouchableOpacity>

            {/* Selected Files List */}
            {selectedFiles && selectedFiles.length > 0 && (
              <View style={styles.selectedFilesContainer}>
                {selectedFiles.map((fileName, index) => (
                  <View key={index} style={styles.fileItem}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {fileName}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeFile(index)}
                      style={styles.removeFileButton}
                    >
                      <MaterialCommunityIcons
                        name="close"
                        size={16}
                        color="#FF3B30"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            {errors.files && (
              <Text style={styles.errorText}>{errors.files.message}</Text>
            )}
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (isSubmitting || !isValid) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
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
    backgroundColor: "white",
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
    color: "#000000",
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
    color: "black",
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
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000000",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  inputError: {
    borderColor: "#FF3B30",
    borderWidth: 2,
  },
  errorText: {
    color: "#FF3B30",
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
    borderColor: "#007AFF",
  },
  fileButtonText: {
    color: "#007AFF",
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
    backgroundColor: "#F2F2F7",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    color: "black",
    marginRight: 8,
  },
  removeFileButton: {
    padding: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#C7C7CC",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
