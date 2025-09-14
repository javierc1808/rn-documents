import Toast from "react-native-toast-message";

class ToastService {
  static instance: ToastService;

  constructor() {
    if (ToastService.instance) {
      return ToastService.instance;
    }
    ToastService.instance = this;
  }

  show(title: string, message: string, type: "success" | "error" | "info" | "warning") {
    return Toast.show({
      type: type,
      text1: title,
      text2: message,
      position: "bottom",
      swipeable: true,
      visibilityTime: 5000,
    });
  }

  hide() {
    return Toast.hide();
  }
};

export default new ToastService();