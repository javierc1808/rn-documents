import * as Notifications from "expo-notifications";
import { Alert, Linking } from "react-native";

class LocalNotificationService {
  private static instance: LocalNotificationService;
  private _canShowNotification = true;
  private _isValid = false;
  private _isBusy = false;

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
          if (this._isBusy) {
            return this._isValid = false;
          }

          this._canShowNotification = false;
          this._isBusy = true;
          Alert.alert(
            "Notification Permissions Required",
            "To receive notifications you must accept permissions in the app settings",
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => {
                  this._isBusy = false;
                },
              },
              {
                text: "Go to Settings",
                onPress: () => {
                  Linking.openSettings();
                  this._isBusy = false;
                },
              },
            ]
          );

          return this._isValid = false;
        }
      }

      return this._isValid = true;
    } catch (error) {
      console.error("Error validating permissions:", error);

      return this._isValid = false;
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
