import { useEffect, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

import { ListByEnum } from "@/src/models/enums";
import { useListByStore } from "@/src/stores/useListByStore";

interface UseAnimatedDocumentItemProps {
  index: number;
  isAnimating: boolean;
  onAnimationComplete?: () => void;
  isInitialLoad?: boolean;
}

export const useAnimatedDocumentItem = ({
  index,
  isAnimating,
  onAnimationComplete,
  isInitialLoad = false,
}: UseAnimatedDocumentItemProps) => {
  const { activeElement } = useListByStore();

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

  const animatedStyle: StyleProp<ViewStyle> = {
    opacity: fadeAnim,
    transform: [{ scale: scaleAnim }],
  };

  return {
    animatedStyle,
    isGridMode,
  };
};
