import { useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { AppState } from "react-native";

import { useAuthContext } from "@/src/context/AuthContext";
import { useStackLayout } from "@/src/hooks/useStackLayout";
import LocalNotificationService from "@/src/services/LocalNotificationService";
import ToastService from "@/src/services/ToastService";
import { useNotificationsStore } from "@/src/stores/useNotificationsStore";

export function useDocumentsWS(url: string) {
  const queryClient = useQueryClient();
  const { authToken } = useAuthContext();
  const { openNotifications } = useStackLayout();

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 10; // Maximum attempts before increasing the delay
    const baseDelay = 1000; // Base delay of 1 second
    const maxDelay = 30000; // Maximum delay of 30 seconds

    const connect = () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        return; // Already connected
      }

      try {
        ws = new WebSocket(url);
        console.log(
          `Attempting to connect to WebSocket (attempt ${reconnectAttempts + 1})`
        );

        ws.onopen = () => {
          console.log("WebSocket connected successfully");
          reconnectAttempts = 0; // Reset attempts on successful connection
        };

        ws.onmessage = async (ev) => {
          try {
            const msg = JSON.parse(ev.data);

            console.log(msg);

            if (
              msg.type === "document.created" ||
              msg.type === "document.created.fake"
            ) {
              const typeNotification =
                msg.type === "document.created.fake" ? "FAKE" : "REAL";

              // Invalidate to refresh
              if (typeNotification === "REAL") {
                queryClient.invalidateQueries({ queryKey: ["documents"] });
              }

              // Background notification
              useNotificationsStore.getState().add({
                userName: msg.user_name,
                userId: msg.user_id,
                documentId: msg.document_id,
                documentTitle: msg.document_title,
                type: msg.type,
                createdAt: new Date(msg.timestamp).toISOString(),
              });

              if (LocalNotificationService.canShowNotification) {
                await LocalNotificationService.validatePermissions();
              }

              if (AppState.currentState === "active") {
                ToastService.show(
                  "📄 New document",
                  `${msg.user_name} added "${msg.document_title}" (${typeNotification})`,
                  "info"
                );
              } else {
                if (LocalNotificationService.isValid) {
                  LocalNotificationService.scheduleNotificationAsync(
                    "📄 New document",
                    `${msg.user_name} added "${msg.document_title}" (${typeNotification})`,
                    msg
                  );
                }
              }
            }
          } catch (error) {
            console.log("Error parsing WebSocket message:", error);
          }
        };

        ws.onclose = (event) => {
          console.log("WebSocket closed", event.code, event.reason);

          // Only reconnect if it was not an intentional close
          if (event.code !== 1000) {
            scheduleReconnect();
          }
        };

        ws.onerror = (ev) => {
          console.log("WebSocket error:", ev);
        };
      } catch (error) {
        console.log("Error creating WebSocket:", error);
        scheduleReconnect();
      }
    };

    const scheduleReconnect = () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        baseDelay *
          Math.pow(2, Math.min(reconnectAttempts, maxReconnectAttempts)),
        maxDelay
      );

      console.log(
        `Scheduling reconnection in ${delay}ms (attempt ${reconnectAttempts + 1})`
      );

      reconnectTimeout = setTimeout(() => {
        reconnectAttempts++;
        connect();
      }, delay);
    };

    // Start the first connection
    connect();

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (ws) {
        ws.close(1000, "Component unmounting"); // Intentional close
      }
    };
  }, [url, queryClient, authToken]);

  // Listener para manejar cuando se presiona una notificación
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log("DATA", data);
      // Si la notificación tiene un documentId, buscar la notificación correspondiente
      if (data && data.document_id) {
        const notifications = useNotificationsStore.getState().items;
        const notification = notifications.find(n => n.documentId === data.document_id);

        if (notification) {
          // Abrir el drawer y hacer scroll a la notificación específica
          openNotifications(notification.id);
        } else {
          // Si no se encuentra la notificación, abrir el drawer normalmente
          openNotifications();
        }
      } else {
        // Si no hay data específica, abrir el drawer normalmente
        openNotifications();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [openNotifications]);
}

