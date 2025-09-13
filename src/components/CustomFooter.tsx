import { useNavigation } from "@react-navigation/native";
import { Button, StyleSheet, View } from "react-native";

export default function CustomFooter() {
  const { navigate } = useNavigation();

  return <View style={styles.container}>
  <Button
    title="Add document"
    onPress={() => {
      navigate("add-document" as never);
    }}
  />
</View>
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderTopWidth: 0.5,
    borderTopColor: "lightgray",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});