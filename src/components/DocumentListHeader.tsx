import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/src/hooks/useTheme";
import { formatRelativeTime } from "@/src/utils/dateFormat";

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
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {networkStatus === "error" ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <View style={styles.retryHint}>
            <Text style={styles.retryText}>Pull to try again</Text>
          </View>
        </View>
      ) : (
        <View style={styles.syncContainer}>
          <Text style={[styles.syncText, { color: theme.colors.text }]}>
            Last sync:{" "}
            {lastSyncAt
              ? formatRelativeTime(new Date(lastSyncAt).toISOString())
              : "—"}
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
