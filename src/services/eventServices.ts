// src/services/eventServices.ts
import axios from "axios";
// Ensure EventsResponse is correctly imported or defined here
import { EventsResponse, Event,EventData } from "../types/types";

axios.defaults.withCredentials = true;

const fetchEvents = async (page = 1): Promise<EventsResponse> => {
  try {
    const { data } = await axios.get<EventsResponse>(
      `https://gateway-auth-service-mahmoud.onrender.com/api/events?page=${page}&size=8`
    );
    return data;
  } catch (error) {
    // Log the error or handle it appropriately
    console.error("Failed to fetch events:", error);
    throw new Error("Failed to fetch events");
  }
};

const fetchEventById = async (eventId: string): Promise<Event> => {
  try {
    const { data } = await axios.get<Event>(
      `https://gateway-auth-service-mahmoud.onrender.com/api/events/${eventId}`
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch event by ID:", error);
    throw new Error("Failed to fetch event");
  }
};

const addCommentToEvent = async (
  selectedEventId: string,
  commentText: string
): Promise<{ success: boolean; message?: string }> => {
  if (!commentText.trim()) {
    return { success: false, message: "Comment text cannot be empty." };
  }

  try {
    await axios.post(
      `https://gateway-auth-service-mahmoud.onrender.com/api/events/${selectedEventId}/comments`,
      {
        content: commentText,
      }
    );
    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw { status: error.response?.status };
    } else {
      throw { status: 'network_error' };
    }
  }
};

const ReleaseTicket = async (
  eventId: string,
  categoryId: string,
  quantity: number
) => {
  try {
    const response = await axios.post(
      `https://gateway-auth-service-mahmoud.onrender.com/api/events/${eventId}/tickets/release`,
      {
        categoryId: categoryId,
        quantity: quantity,
      }
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw { status: error.response?.status };
    } else {
      throw { status: 'network_error' };
    }
  }
};

const ReserveTicket = async (
  eventId: string,
  categoryId: string,
  quantity: number
) => {
  try {
    const response = await axios.post(
      `https://gateway-auth-service-mahmoud.onrender.com/api/events/${eventId}/tickets/reserve`,
      {
        ticketCategoryId: categoryId,
        quantity: quantity,
      }
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw { status: error.response?.status };
    } else {
      throw { status: 'network_error' };
    }
  }
};

const updateEvent = async (
  eventId: string,
  startDate: string | null,
  endDate: string | null
): Promise<Event> => {
  try {
    const payload: { startDate?: string, endDate?: string } = {};
    if (startDate) payload.startDate = startDate;
    if (endDate) payload.endDate = endDate;

    const { data } = await axios.put<Event>(
      `https://gateway-auth-service-mahmoud.onrender.com/api/events/${eventId}`,
      payload
    );
    return data;
  } catch (error) {
    console.error("Failed to update event:", error);
    throw new Error("Failed to update event");
  }
};
interface CreateEventRequestData extends Omit<EventData, "comments" | "ticketCategories"> {
  ticketCategories: TicketCategory[];
  min_price: number;
}

// Replace TicketCategory with the correct type according to your needs
interface TicketCategory {
  name: string;
  price: number;
  quantityAvailable: number;
  quantityReserved: number;
  quantitySold: number;
}

// Function to create a new event
const createEvent = async (eventData: CreateEventRequestData): Promise<void> => {
  try {
    // Set withCredentials if your API requires cookies, auth headers, etc.
    axios.defaults.withCredentials = true;

    const response = await axios.post(
      "https://gateway-auth-service-mahmoud.onrender.com/api/events",
      eventData
    );

    if (response.status === 201) {
      // You can return something here if needed, for example, the created event data
      return response.data;
    } else {
      // Handle unexpected status codes
      console.error("Unexpected response status:", response.status);
      throw new Error("Failed to create event: unexpected response status.");
    }
  } catch (error) {
    console.error("Error creating event:", error);
    // Rethrow the error or handle it as needed
    throw error;
  }
};
export {
  createEvent,
  updateEvent,
  fetchEvents,
  fetchEventById,
  addCommentToEvent,
  ReleaseTicket,
  ReserveTicket,
};
