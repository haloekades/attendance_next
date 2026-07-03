"use client";

import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

export interface EmployeeUpdatedEvent {
  employeeId: number;
  name: string;
  changedFields: string[];
  updatedAt: string;
}

export function useAdminNotifications(token: string | null) {
  const [notifications, setNotifications] = useState<EmployeeUpdatedEvent[]>(
    []
  );

  useEffect(() => {
    if (!token) return;

    const socket: Socket = io(
      `${process.env.NEXT_PUBLIC_GATEWAY_URL}/notifications`,
      { auth: { token } }
    );

    socket.on("employee.updated", (event: EmployeeUpdatedEvent) => {
      setNotifications((prev) => [event, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return notifications;
}
