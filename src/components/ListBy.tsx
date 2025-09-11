import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ListByEnum } from "@/src/models/enums";
import { useListByStore } from "@/src/stores/useListByStore";

export default function ListBy() {

  const activeElement = useListByStore((state) => state.activeElement);
  const setActiveElement = useListByStore((state) => state.setActiveElement);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.elementContainer,
          activeElement === ListByEnum.LIST && styles.activeElementContainerList,
        ]}
        onPress={() => setActiveElement(ListByEnum.LIST)}
      >
        <FontAwesome6
          name="list"
          size={20}
          color={activeElement === ListByEnum.LIST ? "#4281F2" : "gray"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.elementContainer,
          activeElement === ListByEnum.GRID && styles.activeElementContainerGrid,
        ]}
        onPress={() => setActiveElement(ListByEnum.GRID)}
      >
        <MaterialCommunityIcons
          name="grid-large"
          size={22}
          color={activeElement === ListByEnum.GRID ? "#4281F2" : "gray"}
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
