import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { useTheme } from "@/src/hooks/useTheme";
import { ListByEnum } from "@/src/models/enums";
import { Document } from "@/src/models/types";
import { useListByStore } from "@/src/stores/useListByStore";

export default function DocumentItem({ data, style }: { data: Document, style?: StyleProp<ViewStyle> }) {
  const theme = useTheme();
  const { activeElement } = useListByStore();

  if (activeElement === ListByEnum.GRID) {
    return (
      <View style={[styles.cardContainer, { backgroundColor: theme.colors.card }, style]}>
        <View style={styles.gridTitleContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{data.title}</Text>
          <View style={styles.sizeBox} />
          <Text style={[styles.version, { color: theme.colors.textSecondary }]}>Version {data.version}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.cardContainer, { backgroundColor: theme.colors.card }, style]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{data.title}</Text>
        <Text style={[styles.version, { color: theme.colors.textSecondary }]} numberOfLines={1} ellipsizeMode="tail">Version {data.version}</Text>
      </View>
      <View style={styles.rowContainer}>
        <View style={styles.descriptionContainer}>
          <View style={styles.descriptionTitleContainer}>
            <MaterialCommunityIcons
              name="account-group-outline"
              size={24}
              color={theme.colors.icon}
            />
            <View style={styles.sizeBox} />
            <Text style={[styles.descriptionTitle, { color: theme.colors.text }]}>Contributors</Text>
          </View>
          {data.contributors.map((contributor, index) => (
            <View
              key={`${contributor.id}-${index}`}
              style={styles.separator}
            >
              <Text style={[styles.title2, { color: theme.colors.textSecondary }]}>
                {contributor.name}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.descriptionContainer}>
          <View style={styles.descriptionTitleContainer}>
            <FontAwesome5 name="link" size={16} color={theme.colors.icon} />
            <View style={styles.sizeBox} />
            <Text style={[styles.descriptionTitle, { color: theme.colors.text }]}>Attachments</Text>
          </View>
          {data.attachments.map((attachment, index) => (
            <View key={`${attachment}-${index}`} style={styles.separator}>
              <Text style={[styles.title2, { color: theme.colors.textSecondary }]}>{attachment}</Text>
            </View>
          ))}
        </View>
      </View>
      <View>
        <Text style={{ color: theme.colors.textTertiary }}>{data.createdAt}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    padding: 20,
    borderRadius: 5,
  },
  gridTitleContainer: {
    alignItems: "flex-start",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  title: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  version: {
    flexShrink: 0,
    textAlign: "center",
    fontSize: 12,
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
  rowContainer: {
    flexDirection: "row",
  },
  title2: {
    fontSize: 14,
  },
  separator: {
    marginBottom: 8,
  },
});
