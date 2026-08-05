import { CheckCircle2, Circle, Clock } from "lucide-react";
import type { OrderStatus } from "./order-status-badge";

interface TimelineEvent {
  label: string;
  date: string;
  time: string;
  completed: boolean;
  current: boolean;
}

interface OrderTimelineProps {
  status: OrderStatus;
}

export function OrderTimeline({ status }: OrderTimelineProps) {
  // Map status to timeline progression
  const statusOrder: OrderStatus[] = [
    "pending",
    "confirmed",
    "processing",
    "packed",
    "ready-to-ship",
    "shipped",
    "delivered",
  ];

  const currentIndex = statusOrder.indexOf(status);

  const events: TimelineEvent[] = [
    {
      label: "Order Placed",
      date: "Dec 15, 2024",
      time: "10:30 AM",
      completed: currentIndex >= 0,
      current: currentIndex === 0,
    },
    {
      label: "Payment Confirmed",
      date: "Dec 15, 2024",
      time: "10:31 AM",
      completed: currentIndex >= 1,
      current: currentIndex === 1,
    },
    {
      label: "Vendor Accepted",
      date: "Dec 15, 2024",
      time: "11:15 AM",
      completed: currentIndex >= 2,
      current: currentIndex === 2,
    },
    {
      label: "Packed",
      date: currentIndex >= 3 ? "Dec 15, 2024" : "Pending",
      time: currentIndex >= 3 ? "2:45 PM" : "",
      completed: currentIndex >= 3,
      current: currentIndex === 3,
    },
    {
      label: "Ready to Ship",
      date: currentIndex >= 4 ? "Dec 16, 2024" : "Pending",
      time: currentIndex >= 4 ? "9:00 AM" : "",
      completed: currentIndex >= 4,
      current: currentIndex === 4,
    },
    {
      label: "Courier Picked Up",
      date: currentIndex >= 5 ? "Dec 16, 2024" : "Pending",
      time: currentIndex >= 5 ? "11:30 AM" : "",
      completed: currentIndex >= 5,
      current: currentIndex === 5,
    },
    {
      label: "Delivered",
      date: currentIndex >= 6 ? "Dec 18, 2024" : "Expected: Dec 20, 2024",
      time: currentIndex >= 6 ? "3:20 PM" : "",
      completed: currentIndex >= 6,
      current: currentIndex === 6,
    },
  ];

  return (
    <div className="relative">
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={index} className="relative flex gap-4">
            {/* Timeline Line */}
            {index < events.length - 1 && (
              <div
                className={`absolute left-[15px] top-8 w-0.5 h-full ${
                  event.completed ? "bg-emerald-500" : "bg-gray-300"
                }`}
              />
            )}

            {/* Icon */}
            <div className="relative z-10 flex-shrink-0">
              {event.completed ? (
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
              ) : event.current ? (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                  <Clock className="h-5 w-5 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Circle className="h-5 w-5 text-gray-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4
                    className={`font-medium ${
                      event.completed || event.current ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {event.label}
                  </h4>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {event.date} {event.time && `• ${event.time}`}
                  </p>
                </div>
                {event.current && (
                  <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    Current
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
