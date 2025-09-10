import { Entypo } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useSortByStore } from '@/src/stores/useSortByStore';

// const sortByList = [
//   {
//       label: "Recent",
//       value: SortByEnum.RECENT,
//   },
//   {
//       label: "Oldest",
//       value: SortByEnum.OLDEST,
//   },
//   {
//       label: "A-Z",
//       value: SortByEnum.AZ,
//   },
//   {
//       label: "Z-A",
//       value: SortByEnum.ZA,
//   },
// ];

export default function SortBy() {
  const activeElement = useSortByStore((state) => state.activeElement);
  const handlePress = useSortByStore((state) => state.handlePress);

  const formattedActiveElement = useMemo(() => activeElement.charAt(0).toUpperCase() + activeElement.slice(1), [activeElement]);

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={[styles.rowContainer, styles.activeElementContainerList]}>
        <Entypo name="select-arrows" size={18} color="black" />
        <Text style={styles.textStyle}>Sort by ({formattedActiveElement})</Text>
      </View>
      <View style={[styles.rowContainer, styles.activeElementContainerGrid]}>
        <Entypo name="chevron-down" size={18} color="black" />
      </View>
    </Pressable>
  )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
  },
  rowContainer: {
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    fontSize: 15,
    fontWeight: "600",
  },
  activeElementContainerList: {
    backgroundColor: "white",
    borderEndWidth: 1,
    borderEndColor: "lightgray",
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
  },
  activeElementContainerGrid: {
    backgroundColor: "white",
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
  },
});