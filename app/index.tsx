import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DocumentList from "@/src/components/DocumentList";
import ListBy from "@/src/components/ListBy";
import { useTheme } from "@/src/hooks/useTheme";

export default function DocumentScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.sortListContainer}>
        <View>
          <Text>Sort By</Text>
        </View>
        <ListBy/>
      </View>

      <DocumentList/>

      <View style={styles.footer}>
        <Button title="Add document" onPress={() => {}} />
      </View>
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
  contentContainer: {
    padding: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 0.5,
    borderTopColor: "lightgray",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sizeBox: {
    width: 10,
    height: 10,
  },
});
