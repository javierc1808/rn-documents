import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "@/src/hooks/useTheme";

export default function CustomFooter() {
  const theme = useTheme();
  const { navigate } = useNavigation();

  const handleAddDocument = () => {
    navigate("add-document" as never);
  };

  return (
    <View style={[styles.container, { borderTopColor: theme.colors.border }]}>
      <TouchableOpacity
        style={[styles.containerButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddDocument}
      >
        <Text style={styles.buttonText}>Add document</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderTopWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  containerButton: {
    width: "100%",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
