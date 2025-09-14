import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef } from "react";
import { Animated, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { ListByEnum } from "@/src/models/enums";
import { Document } from "@/src/models/types";
import { useListByStore } from "@/src/stores/useListByStore";

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
  const { activeElement } = useListByStore();

  // Function to format the date
  const formatDate = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return dateString; // Return original string if there's an error
    }
  }, []);

  // Initialize with appropriate values according to context
  const initialOpacity = isInitialLoad ? 1 : 0;
  const isGridMode = activeElement === ListByEnum.GRID;
  const initialScale = isInitialLoad ? 1 : (isGridMode ? 0.9 : 0.8);

  const fadeAnim = useRef(new Animated.Value(initialOpacity)).current;
  const scaleAnim = useRef(new Animated.Value(initialScale)).current;

  useEffect(() => {
    if (isAnimating) {
      // Adjust parameters according to display mode
      const isGridMode = activeElement === ListByEnum.GRID;

      // Smoother parameters for grid
      const enterDelay = isGridMode ? index * 60 : index * 80; // Less delay in grid
      const duration = isGridMode ? 500 : 400; // Longer duration in grid
      const initialScale = isGridMode ? 0.9 : 0.8; // Smoother initial scale in grid

      // Adjust initial scale if it's grid
      if (isGridMode) {
        scaleAnim.setValue(initialScale);
      }

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          delay: enterDelay,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration,
          delay: enterDelay,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onAnimationComplete && index === 0) {
          // Only the first element calls the callback
          onAnimationComplete();
        }
      });
    } else if (!isInitialLoad) {
      // Only reset if it's not initial load and not animating
      const isGridMode = activeElement === ListByEnum.GRID;
      const initialScale = isGridMode ? 0.9 : 0.8;

      fadeAnim.setValue(0);
      scaleAnim.setValue(initialScale);
    }
  }, [isAnimating, index, fadeAnim, scaleAnim, onAnimationComplete, isInitialLoad, activeElement]);

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ scale: scaleAnim }],
  };

  if (activeElement === ListByEnum.GRID) {
    return (
      <Animated.View style={[styles.cardContainer, style, animatedStyle]}>
        <View style={styles.gridTitleContainer}>
          <Text style={styles.title}>{data.title}</Text>
          <View style={styles.sizeBox} />
          <Text style={styles.version}>Version {data.version}</Text>
        </View>
        <View style={styles.gridDateContainer}>
          <Text style={styles.dateText}>{formatDate(data.createdAt)}</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.cardContainer, style, animatedStyle]}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.version} numberOfLines={1} ellipsizeMode="tail">Version {data.version}</Text>
      </View>
      <View style={styles.rowContainer}>
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
              style={styles.separator}
            >
              <Text style={styles.title2}>
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
            <View key={`${attachment}-${index}`} style={styles.separator}>
              <Text style={styles.title2}>{attachment}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{formatDate(data.createdAt)}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: "white",
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
  rowContainer: {
    flexDirection: "row",
  },
  title2: {
    fontSize: 14,
    color: "gray",
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
    color: "#666",
    fontWeight: "500",
  },
});
