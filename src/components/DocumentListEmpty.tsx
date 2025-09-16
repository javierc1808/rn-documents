import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/src/hooks/useTheme";

interface DocumentListEmptyProps {
  paddingVertical?: number;
}

export const DocumentListEmpty: React.FC<DocumentListEmptyProps> = ({
  paddingVertical = 48,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { paddingVertical }]}>
      <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
        No documents found
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
});
