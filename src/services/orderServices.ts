import axios from "axios";
import { OrderWithEvent, Order } from "../types/types";

axios.defaults.withCredentials = true;
export const fetchClosestUpcomingEvent = async (): Promise<OrderWithEvent> => {
  let page = 1;
  let totalFetched = 0; 
  let totalOrders = 0;
  let closestEvent: OrderWithEvent | null = null;
  let ordersRes = await fetchUserOrdersWithEvents(page);
  totalOrders = ordersRes.total;
  let ordersWithEvents = ordersRes.data;

  while (totalFetched < totalOrders) {
    const paidOrders = ordersWithEvents.filter(
      (order) => order.status === "Paid"
    );
    const sortedByStartDate = paidOrders.sort(
      (a, b) =>
        new Date(a.event.startDate).getTime() -
        new Date(b.event.startDate).getTime()
    );
    const now = new Date();

    // Ensure there are paid orders before finding the closest event
    if (sortedByStartDate.length > 0) {
      const upcomingEvent = sortedByStartDate.find(
        (order) => new Date(order.event.startDate) > now
      );

      if (upcomingEvent) {
        // Compare with the currently found closest event, if any
        if (
          !closestEvent ||
          new Date(upcomingEvent.event.startDate) <
            new Date(closestEvent.event.startDate)
        ) {
          closestEvent = upcomingEvent;
          // break; // Uncomment this if you're sure no closer event can be found in further pages
        }
      }
    } 
    page += 1;
    totalFetched += ordersWithEvents.length; // Adjust based on the actual number of orders fetched
    if (totalFetched < totalOrders) {
      ordersRes = await fetchUserOrdersWithEvents(page);
      ordersWithEvents = ordersRes.data;
    }
  }

  if (!closestEvent) {
    throw new Error("No upcoming event found.");
  }

  return closestEvent;
};

export const fetchUserOrdersWithEvents = async (
  page = 1
): Promise<{ data: OrderWithEvent[]; total: number }> => {
  const response = await axios.get(
    `https://gateway-auth-service-mahmoud.onrender.com/api/orders/user?page=${page}&size=6`
  );
  const { data, total } = response.data;

  const ordersWithEventsPromises = data.map(async (order: Order) => {
    const { data: event } = await axios.get(
      `https://gateway-auth-service-mahmoud.onrender.com/api/events/${order.eventId}`
    );
    return {
      ...order,
      event,
    };
  });

  const ordersWithEvents = await Promise.all(ordersWithEventsPromises);
  return { data: ordersWithEvents, total };
};

export const RefundOrder = async (orderId: string) => {
  try {
    const response = await axios.post(
      `https://gateway-auth-service-mahmoud.onrender.com/api/orders/refund/?orderId=${orderId}`
    );
    return response;
  } catch (error) {
    console.error("Refund error:", error);
    throw new Error("Failed to refund order");
  }
};

export const PayTheOrder = async (
  orderId: String,
  formData: any,
  quantity: number,
  pricePerTicket: number
) => {
  try {
    const paymentResult = await axios.put(
      `https://gateway-auth-service-mahmoud.onrender.com/api/orders/payment?orderId=${orderId}`,
      {
        ...formData,
        charge: quantity * pricePerTicket,
      }
    );
    if (paymentResult.status === 200) {
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error("Checkout error:", error);
    throw new Error("Failed to checkout");
  }
};

export const CreateOrder = async (
  eventId: string,
  ticketCategory: string,
  quantity: number,
  totalPrice: number
): Promise<Order> => {
  try {
    const { data: orderResponse } = await axios.post<Order>(
      "https://gateway-auth-service-mahmoud.onrender.com/api/orders",
      {
        eventId,
        ticketCategory,
        quantity,
        totalPrice,
      }
    );
    return orderResponse;
  } catch (error) {
    console.error("Create order error:", error);
    throw new Error("Failed to create order");
  }
};
