import React from "react";
import { Text } from "react-native";

// Mock para todos los iconos de @expo/vector-icons
const createIconMock = (name) => {
  const IconComponent = React.forwardRef((props, ref) => {
    const { name: iconName, size = 24, color = "#000", ...otherProps } = props;
    return React.createElement(
      Text,
      {
        ref,
        ...otherProps,
        style: [
          {
            fontSize: size,
            color: color,
            textAlign: "center",
            lineHeight: size,
          },
          props.style,
        ],
        testID: `icon-${iconName}`,
      },
      `[${iconName}]`,
    );
  });

  IconComponent.displayName = name;
  return IconComponent;
};

// Mock para FontAwesome5
export const FontAwesome5 = createIconMock("FontAwesome5");

// Mock para MaterialCommunityIcons
export const MaterialCommunityIcons = createIconMock("MaterialCommunityIcons");

// Mock para otros iconos comunes
export const AntDesign = createIconMock("AntDesign");
export const Entypo = createIconMock("Entypo");
export const EvilIcons = createIconMock("EvilIcons");
export const Feather = createIconMock("Feather");
export const Fontisto = createIconMock("Fontisto");
export const Foundation = createIconMock("Foundation");
export const Ionicons = createIconMock("Ionicons");
export const MaterialIcons = createIconMock("MaterialIcons");
export const Octicons = createIconMock("Octicons");
export const SimpleLineIcons = createIconMock("SimpleLineIcons");
export const Zocial = createIconMock("Zocial");

// Export por defecto
export default {
  FontAwesome5,
  MaterialCommunityIcons,
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
};
