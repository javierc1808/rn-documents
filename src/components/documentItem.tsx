import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Contributor, Document } from "../models/types";

export default function DocumentItem({ data }: { data: Document }) {
  const ContributorItem = useCallback((contributor: Contributor) => {
    return (
      <View key={contributor.id} style={{ marginBottom: 8 }}>
        <Text style={{ fontSize: 14, color: "gray" }}>{contributor.name}</Text>
      </View>
    );
  }, []);

  const AttachmentItem = useCallback((attachment: string) => {
    return (
      <View key={attachment} style={{ marginBottom: 8 }}>
        <Text style={{ fontSize: 14, color: "gray" }}>{attachment}</Text>
      </View>
    );
  }, []);

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
          {data.contributors.map((contributor) => ContributorItem(contributor))}
        </View>
        <View style={styles.descriptionContainer}>
          <View style={styles.descriptionTitleContainer}>
            <FontAwesome5 name="link" size={16} color="gray" />
            <View style={styles.sizeBox} />
            <Text style={styles.descriptionTitle}>Attachments</Text>
          </View>
          {data.attachments.map((attachment) => AttachmentItem(attachment))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 16,
    borderRadius: 5,
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
