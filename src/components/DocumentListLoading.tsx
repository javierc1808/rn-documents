import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface DocumentListLoadingProps {
  size?: "small" | "large";
}

export const DocumentListLoading: React.FC<DocumentListLoadingProps> = ({
  size = "large",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
