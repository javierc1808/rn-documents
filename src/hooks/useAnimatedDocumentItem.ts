import { useCallback, useEffect, useRef } from "react";
import { Animated } from "react-native";

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

  // Function to show relative time (e.g., "1 day ago", "now")
  const formatRelativeTime = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInSeconds = Math.floor(diffInMs / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      const diffInWeeks = Math.floor(diffInDays / 7);
      const diffInMonths = Math.floor(diffInDays / 30);
      const diffInYears = Math.floor(diffInDays / 365);

      if (diffInSeconds < 60) {
        return 'now';
      } else if (diffInMinutes < 60) {
        return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
      } else if (diffInHours < 24) {
        return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
      } else if (diffInDays < 7) {
        return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
      } else if (diffInWeeks < 4) {
        return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
      } else if (diffInMonths < 12) {
        return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
      } else {
        return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
      }
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

  return {
    animatedStyle,
    formatDate,
    formatRelativeTime,
    isGridMode,
  };
};
