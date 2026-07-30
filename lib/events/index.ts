import { EventEmitter } from "events";

class DomainEventEmitter extends EventEmitter {}

export const domainEvents = new DomainEventEmitter();

// Event topic names
export const EVENT_TOPICS = {
  ORDER_CREATED: "order.created",
  ORDER_STATUS_CHANGED: "order.status_changed",
  PRODUCT_CREATED: "product.created",
  PRODUCT_UPDATED: "product.updated",
  STOCK_LOW: "stock.low",
  USER_REGISTERED: "user.registered",
  VENDOR_UPGRADED: "vendor.upgraded",
  REVIEW_CREATED: "review.created",
  MESSAGE_SENT: "message.sent",
};
