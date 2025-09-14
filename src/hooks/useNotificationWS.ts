import { useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useNotificationsStore } from "../stores/useNotificationsStore";

export function useDocumentsWS(url: string) {
  const queryClient = useQueryClient();
  const { authToken } = useAuthContext();

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 10; // Maximum attempts before increasing the delay
    const baseDelay = 1000; // Base delay of 1 second
    const maxDelay = 30000; // Maximum delay of 30 seconds
    let isConnected = false;

    // First, set the handler that will cause the notification
    // to show the alert
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    const connect = () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        return; // Already connected
      }

      try {
        ws = new WebSocket(url);
        console.log(`Attempting to connect to WebSocket (attempt ${reconnectAttempts + 1})`);

        ws.onopen = () => {
          console.log("WebSocket connected successfully");
          isConnected = true;
          reconnectAttempts = 0; // Reset attempts on successful connection
        };

        ws.onmessage = (ev) => {
          try {
            const msg = JSON.parse(ev.data);

            console.log(msg);

            if (msg.type === "document.created" || msg.type === "document.created.fake") {
              // Invalidate to refresh
              // queryClient.invalidateQueries({ queryKey: ["documents"] });

              // Optional: emit local event for UI/Toast
              //showInAppToast(`New document: ${msg.payload.name}`);

              // Background notification
              useNotificationsStore.getState().add({
                userName: msg.user_name,
                userId: msg.user_id,
                documentId: msg.document_id,
                documentTitle: msg.document_title,
                type: msg.type,
                createdAt: new Date(msg.timestamp).toISOString(),
              });


              const type = msg.type === "document.created.fake" ? "FAKE" : "REAL";

              // Second, call scheduleNotificationAsync()
              sendNotification(
                "📄 New document",
                `${msg.user_name} added "${msg.document_title}" (${type})`,
                msg
              );
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        ws.onclose = (event) => {
          console.log("WebSocket closed", event.code, event.reason);
          isConnected = false;

          // Only reconnect if it was not an intentional close
          if (event.code !== 1000) {
            scheduleReconnect();
          }
        };

        ws.onerror = (ev) => {
          console.error("WebSocket error", ev);
          isConnected = false;
        };

      } catch (error) {
        console.error("Error creating WebSocket:", error);
        scheduleReconnect();
      }
    };

    const scheduleReconnect = () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        baseDelay * Math.pow(2, Math.min(reconnectAttempts, maxReconnectAttempts)),
        maxDelay
      );

      console.log(`Scheduling reconnection in ${delay}ms (attempt ${reconnectAttempts + 1})`);

      reconnectTimeout = setTimeout(() => {
        reconnectAttempts++;
        connect();
      }, delay);
    };

    // Start the first connection
    connect();

    return () => {
      isConnected = false;
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (ws) {
        ws.close(1000, "Component unmounting"); // Intentional close
      }
    };
  }, [url, queryClient, authToken]);
}

function sendNotification(title: string, body: string, data: any) {
  Notifications.getPermissionsAsync().then((permissions) => {
    console.log("permissions", permissions);
    if (permissions.status !== "granted") {
      Notifications.requestPermissionsAsync().then((permissions) => {
        console.log("permissions", permissions);
        Notifications.scheduleNotificationAsync({
          content: { title,  body, data },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 2,
          },
        });
      }).catch((error) => {
        console.error("Error requesting permissions:", error);
      });
    }
    else {
      Notifications.scheduleNotificationAsync({
        content: { title, body, data },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
        },
      });
    }
  })
  .catch((error) => {
    console.error("Error sending notification:", error);
  });
}
