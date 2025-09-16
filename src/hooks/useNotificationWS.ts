import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { AppState } from "react-native";

import { useAuthContext } from "@/src/context/AuthContext";
import { NotificationMessage } from "@/src/models/types";
import LocalNotificationService from "@/src/services/LocalNotificationService";
import ToastService from "@/src/services/ToastService";
import { useNotificationsStore } from "@/src/stores/useNotificationsStore";

export function useNotificationWS() {
  const queryClient = useQueryClient();
  const { authToken, user } = useAuthContext();

  useEffect(() => {
    const url = process.env.EXPO_PUBLIC_WS_URL || "ws://localhost:8080";
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
        ws = new WebSocket(url + "/notifications");
        console.log(
          `Attempting to connect to WebSocket (attempt ${reconnectAttempts + 1})`
        );

        ws.onopen = () => {
          console.log("WebSocket connected successfully");
          reconnectAttempts = 0; // Reset attempts on successful connection
        };

        ws.onmessage = async (ev) => {
          try {
            const msg = JSON.parse(ev.data) as NotificationMessage;

            if (
              (msg.type === "document.created" ||
                msg.type === "document.created.fake") && msg.userId !== user?.id
            ) {
              const typeNotification =
                msg.type === "document.created.fake" ? "FAKE" : "REAL";

              // Invalidate to refresh
              if (typeNotification === "REAL") {
                queryClient.invalidateQueries({ queryKey: ["documents"] });
              }

              // Background notification
              useNotificationsStore.getState().add({
                userName: msg.userName,
                userId: msg.userId,
                documentId: msg.documentId,
                documentTitle: msg.documentTitle,
                type: msg.type,
                createdAt: new Date(msg.timestamp).toISOString(),
              });

              if (LocalNotificationService.canShowNotification) {
                await LocalNotificationService.validatePermissions();
              }

              if (AppState.currentState === "active") {
                ToastService.show(
                  "📄 New document",
                  `${msg.userName} added "${msg.documentTitle}" (${typeNotification})`,
                  "info"
                );
              } else {
                if (LocalNotificationService.isValid) {
                  LocalNotificationService.scheduleNotificationAsync(
                    "📄 New document",
                    `${msg.userName} added "${msg.documentTitle}" (${typeNotification})`,
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
  }, [queryClient, authToken, user]);
}
