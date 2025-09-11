import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { ListByEnum } from "@/src/models/enums";
import { Document } from "@/src/models/types";
import { useListByStore } from "@/src/stores/useListByStore";

export default function DocumentItem({ data }: { data: Document }) {
  const { activeElement } = useListByStore();

  if (activeElement === ListByEnum.GRID) {
    return (
      <View style={styles.container}>
        <View style={styles.gridTitleContainer}>
          <Text style={styles.title}>{data.title}</Text>
          <View style={styles.sizeBox} />
          <Text style={styles.version}>Version {data.version}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{data.title}</Text>
        <View style={styles.sizeBox} />
        <Text style={styles.version}>Version {data.version}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.descriptionContainer}>
          <View style={styles.descriptionTitleContainer}>
            <MaterialCommunityIcons
              name="account-group-outline"
              size={24}
              color="gray"
            />
            <View style={styles.sizeBox} />
            <Text style={styles.descriptionTitle}>Contributors</Text>
          </View>
          {data.contributors.map((contributor, index) => (
            <View
              key={`${contributor.id}-${index}`}
              style={{ marginBottom: 8 }}
            >
              <Text style={{ fontSize: 14, color: "gray" }}>
                {contributor.name}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.descriptionContainer}>
          <View style={styles.descriptionTitleContainer}>
            <FontAwesome5 name="link" size={16} color="gray" />
            <View style={styles.sizeBox} />
            <Text style={styles.descriptionTitle}>Attachments</Text>
          </View>
          {data.attachments.map((attachment, index) => (
            <View key={`${attachment}-${index}`} style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 14, color: "gray" }}>{attachment}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 16,
    borderRadius: 5,
  },
  gridTitleContainer: {
    alignItems: "flex-start",
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  version: {
    fontSize: 12,
    color: "gray",
  },
  descriptionContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  descriptionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  descriptionTitle: {
    fontSize: 14,
  },
  sizeBox: {
    width: 10,
    height: 10,
  },
});
