import * as Notifications from "expo-notifications";
import { Alert, Linking } from "react-native";

class LocalNotificationService {
  private static instance: LocalNotificationService;
  private _canShowNotification = true;
  private _isValid = false;

  get canShowNotification() {
    return this._canShowNotification;
  }

  get isValid() {
    return this._isValid;
  }

  constructor() {
    if (LocalNotificationService.instance) {
      return LocalNotificationService.instance;
    }
    LocalNotificationService.instance = this;
    LocalNotificationService.init();
  }

  static init() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }

  async validatePermissions() {
    try {
      const permissions = await Notifications.getPermissionsAsync();
      if (permissions.status !== "granted") {
        const requestResult = await Notifications.requestPermissionsAsync();
        if (requestResult.status !== "granted") {
          this._canShowNotification = false;

          Alert.alert(
            "Notification Permissions Required",
            "To receive notifications you must accept permissions in the app settings",
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => {
                },
              },
              {
                text: "Go to Settings",
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ]
          );

          this._isValid = false;
          return this._isValid;
        }
      }

      this._isValid = true;
      return this._isValid;
    } catch (error) {
      console.error("Error validating permissions:", error);

      this._isValid = false;
      return this._isValid;
    }
  }

  async getPermissions() {
    return await Notifications.getPermissionsAsync();
  }

  async requestPermissions() {
    return await Notifications.requestPermissionsAsync();
  }

  async scheduleNotificationAsync(title: string, body: string, data: any) {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
  }

  scheduleNotification(title: string, body: string, data: any) {
    Notifications.scheduleNotificationAsync({
      content: { title, body, data },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
  }
}

export default new LocalNotificationService();
