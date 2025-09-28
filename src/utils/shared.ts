import { Share } from "react-native";

export async function sharedText(title: string, message: string) {

  Share.share({
    message, url: "Shared document: " + title,
  });

}