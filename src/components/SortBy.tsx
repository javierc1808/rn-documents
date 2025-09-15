import { Entypo } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/src/hooks/useTheme';
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
  const theme = useTheme();
  const activeElement = useSortByStore((state) => state.activeElement);
  const handlePress = useSortByStore((state) => state.handlePress);

  const formattedActiveElement = useMemo(() => activeElement.charAt(0).toUpperCase() + activeElement.slice(1), [activeElement]);

  return (
    <Pressable style={[styles.container, { borderColor: theme.colors.border }]} onPress={handlePress}>
      <View style={[styles.rowContainer, styles.activeElementContainerList, { backgroundColor: theme.colors.card, borderEndColor: theme.colors.border }]}>
        <Entypo name="select-arrows" size={18} color={theme.colors.text} />
        <Text style={[styles.textStyle, { color: theme.colors.text }]}>Sort by ({formattedActiveElement})</Text>
      </View>
      <View style={[styles.rowContainer, styles.activeElementContainerGrid, { backgroundColor: theme.colors.card }]}>
        <Entypo name="chevron-down" size={18} color={theme.colors.text} />
      </View>
    </Pressable>
  )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 8,
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
    borderEndWidth: 1,
    borderTopStartRadius: 8,
    borderBottomStartRadius: 8,
  },
  activeElementContainerGrid: {
    borderTopEndRadius: 8,
    borderBottomEndRadius: 8,
  },
});