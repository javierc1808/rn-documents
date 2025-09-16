import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DocumentListHeaderProps {
  networkStatus: "idle" | "ok" | "error";
  errorMessage?: string;
  lastSyncAt?: number;
}

export const DocumentListHeader: React.FC<DocumentListHeaderProps> = ({
  networkStatus,
  errorMessage,
  lastSyncAt,
}) => {
  return (
    <View style={styles.container}>
      {networkStatus === "error" ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {errorMessage}
          </Text>
          <View style={styles.retryHint}>
            <Text style={styles.retryText}>Pull to try again</Text>
          </View>
        </View>
      ) : (
        <View style={styles.syncContainer}>
          <Text style={styles.syncText}>
            Last sync:{" "}
            {lastSyncAt ? new Date(lastSyncAt).toLocaleTimeString() : "—"}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  errorContainer: {
    backgroundColor: "#FFE5E5",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#FFB3B3",
    alignItems: "center",
  },
  errorText: {
    fontWeight: "600",
  },
  retryHint: {
    marginTop: 8,
  },
  retryText: {
    fontSize: 14,
  },
  syncContainer: {
    opacity: 0.7,
  },
  syncText: {
    fontSize: 14,
  },
});
