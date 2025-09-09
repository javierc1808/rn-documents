import { FontAwesome6 } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { Pressable } from "react-native";

export default function CustomRightHeader() {
  const theme = useTheme();

  return (
    <Pressable
      hitSlop={8}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      <FontAwesome6 name="bell" size={24} color={theme.colors.text} />
    </Pressable>
  );
};
