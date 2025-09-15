import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Animated, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { useAnimatedDocumentItem } from "@/src/hooks/useAnimatedDocumentItem";
import { useTheme } from "@/src/hooks/useTheme";
import { Document } from "@/src/models/types";
import { formatRelativeTime } from "@/src/utils/dateFormat";

interface AnimatedDocumentItemProps {
  data: Document;
  style?: StyleProp<ViewStyle>;
  index: number;
  isAnimating: boolean;
  onAnimationComplete?: () => void;
  isInitialLoad?: boolean;
}

export default function AnimatedDocumentItem({ 
  data, 
  style, 
  index, 
  isAnimating,
  onAnimationComplete,
  isInitialLoad = false
}: AnimatedDocumentItemProps) {
  const theme = useTheme();
  const { animatedStyle, isGridMode } = useAnimatedDocumentItem({
    index,
    isAnimating,
    onAnimationComplete,
    isInitialLoad,
  });

  const formatRelativeTimeMemo = useMemo(() => formatRelativeTime(data.createdAt), [data]);

  if (isGridMode) {
    return (
      <Animated.View style={[styles.cardContainer, { backgroundColor: theme.colors.card }, style, animatedStyle]}>
        <View style={styles.gridTitleContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{data.title}</Text>
          <View style={styles.sizeBox} />
          <Text style={[styles.version, { color: theme.colors.textSecondary }]}>Version {data.version}</Text>
        </View>
        <View style={styles.gridDateContainer}>
          <Text style={[styles.dateText, { color: theme.colors.textTertiary }]}>{formatRelativeTimeMemo}</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.cardContainer, { backgroundColor: theme.colors.card }, style, animatedStyle]}>
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
      <View style={styles.dateContainer}>
        <Text style={[styles.dateText, { color: theme.colors.textTertiary }]}>{formatRelativeTime(data.createdAt)}</Text>
      </View>
    </Animated.View>
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
  gridDateContainer: {
    marginTop: 8,
    alignItems: "flex-start",
  },
  dateContainer: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
