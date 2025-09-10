import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useListByStore } from "../stores/useListByStore";

export default function ListBy() {

  const activeElement = useListByStore((state) => state.activeElement);
  const setActiveElement = useListByStore((state) => state.setActiveElement);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.elementContainer,
          activeElement === "list" && styles.activeElementContainerList,
        ]}
        onPress={() => setActiveElement("list")}
      >
        <FontAwesome6
          name="list"
          size={20}
          color={activeElement === "list" ? "#4281F2" : "gray"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.elementContainer,
          activeElement === "grid" && styles.activeElementContainerGrid,
        ]}
        onPress={() => setActiveElement("grid")}
      >
        <MaterialCommunityIcons
          name="grid-large"
          size={22}
          color={activeElement === "grid" ? "#4281F2" : "gray"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
  },
  elementContainer: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activeElementContainerList: {
    backgroundColor: "white",
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
  },
  activeElementContainerGrid: {
    backgroundColor: "white",
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
  },
});
