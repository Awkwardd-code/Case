const OrderStatus = {
  FULFILLED: "fulfilled",
  SHIPPED: "shipped",
  AWAITING_SHIPMENT: "awaiting_shipment",
} as const;

export type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus];

export { OrderStatus };
