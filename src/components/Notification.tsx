"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type NotificationType = "success" | "error" | "warning" | "info";
type NotificationPosition =
  | "top-start"
  | "top-center"
  | "top-end"
  | "bottom-start"
  | "bottom-center"
  | "bottom-end";

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
  setPosition: (position: NotificationPosition) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    id: number;
  } | null>(null);

  const [position, setPosition] = useState<NotificationPosition>(
    "bottom-end" // default position
  );

  const showNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotification({ message, type, id });
    setTimeout(() => {
      setNotification((current) => (current?.id === id ? null : current));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, setPosition }}>
      {children}
      {notification && (
        <div className={`fixed z-[100] p-4 ${getPositionClass(position)}`}>
          <div
            className={`min-w-[250px] max-w-xs rounded-md shadow-lg px-4 py-3 text-white ${getBgColor(
              notification.type
            )}`}
          >
            <p className="text-sm">{notification.message}</p>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

// Position mapping
function getPositionClass(position: NotificationPosition): string {
  const map = {
    "top-start": "top-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "top-end": "top-4 right-4",
    "bottom-start": "bottom-4 left-4",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
    "bottom-end": "bottom-4 right-4",
  };
  return map[position];
}

// Background color
function getBgColor(type: NotificationType): string {
  switch (type) {
    case "success":
      return "bg-green-600";
    case "error":
      return "bg-red-600";
    case "warning":
      return "bg-yellow-600 text-black";
    case "info":
    default:
      return "bg-blue-600";
  }
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
