import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomFooter from "@/src/components/CustomFooter";
import DocumentList from "@/src/components/DocumentList";
import ListBy from "@/src/components/ListBy";
import SortBy from "@/src/components/SortBy";
import { useTheme } from "@/src/hooks/useTheme";

export default function DocumentsScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.sortListContainer}>
        <SortBy />
        <ListBy />
      </View>

      <DocumentList />

      <CustomFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sortListContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
