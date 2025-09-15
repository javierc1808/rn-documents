import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useTheme } from "@/src/hooks/useTheme";
import { ListByEnum } from "@/src/models/enums";
import { useListByStore } from "@/src/stores/useListByStore";

export default function ListBy() {
  const theme = useTheme();
  const activeElement = useListByStore((state) => state.activeElement);
  const setActiveElement = useListByStore((state) => state.setActiveElement);
  const setIsAnimating = useListByStore((state) => state.setIsAnimating);

  const handleModeChange = (element: ListByEnum) => {
    if (element !== activeElement) {
      // Change mode immediately
      setActiveElement(element);
      // Start entry animation
      setIsAnimating(true);
    }
  };

  return (
    <View style={[styles.container, { borderColor: theme.colors.border }]}>
      <TouchableOpacity
        style={[
          styles.elementContainer,
          activeElement === ListByEnum.LIST && [styles.activeElementContainerList, { backgroundColor: theme.colors.card }],
        ]}
        onPress={() => handleModeChange(ListByEnum.LIST)}
      >
        <FontAwesome6
          name="list"
          size={20}
          color={activeElement === ListByEnum.LIST ? theme.colors.primary : theme.colors.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.elementContainer,
          activeElement === ListByEnum.GRID && [styles.activeElementContainerGrid, { backgroundColor: theme.colors.card }],
        ]}
        onPress={() => handleModeChange(ListByEnum.GRID)}
      >
        <MaterialCommunityIcons
          name="grid-large"
          size={22}
          color={activeElement === ListByEnum.GRID ? theme.colors.primary : theme.colors.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 8,
  },
  elementContainer: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activeElementContainerList: {
    borderTopStartRadius: 8,
    borderBottomStartRadius: 8,
  },
  activeElementContainerGrid: {
    borderTopEndRadius: 8,
    borderBottomEndRadius: 8,
  },
});
