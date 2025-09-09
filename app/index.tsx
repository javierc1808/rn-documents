import DocumentItem from "@/src/components/DocumentItem";
import { mockDocuments } from "@/src/constant/mockDocuments";
import { useTheme } from "@/src/hooks/useTheme";
import { FlashList } from "@shopify/flash-list";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DocumentScreen() {
  const theme = useTheme();

  const data = mockDocuments;

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.sortListContainer}>
        <View>
          <Text>Sort By</Text>
        </View>
        <View>
          <Text>List By</Text>
        </View>
      </View>
      <FlashList
        contentContainerStyle={styles.contentContainer}
        data={data}
        renderItem={({ item }) => (
          <DocumentItem data={item} />
        )}
        estimatedItemSize={200}
      />

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
    marginTop: 15,
    marginBottom: 15,
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
