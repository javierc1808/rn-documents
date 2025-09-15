import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CustomFooter() {
  const { navigate } = useNavigation();

  const handleAddDocument = () => {
    navigate("add-document" as never);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.containerButton}
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
    borderTopColor: "lightgray",
    alignItems: "center",
    justifyContent: "center",
  },
  containerButton: {
    width: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
