import { useState, useContext } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { BackofficeNavigatorContext } from "../../contexts/BackofficeNavigatorContext";
import {createEvent} from '../../services/eventServices'

interface TicketCategory {
  name: string;
  price: string; // You may want to handle prices as numbers, but it seems you're using strings in the state
  totalTickets: string;
}

interface EventData {
  name: string;
  category: string;
  description: string;
  startDate: string;
  endDate: string;
  organizer: string;
  location: string;
  image: string;
  ticketCategories: TicketCategory[];
  comments: any[]; // Define more specifically if possible
}

const initialEventData: EventData = {
  name: "",
  category: "",
  description: "",
  startDate: "",
  endDate: "",
  organizer: "",
  location: "",
  image: "",
  ticketCategories: [{ name: "", price: "", totalTickets: "" }],
  comments: [],
  // You don't need to initialize min_price here since it's derived and optional
};

const NewEventPage = () => {
  const { navigate } = useContext(BackofficeNavigatorContext);

  const [eventData, setEventData] = useState<EventData>(initialEventData);

  const [ticketCategories, setTicketCategories] = useState([
    { name: "", price: "", totalTickets: "" },
  ]);

  const handleEventDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTicketCategoryChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedCategories = ticketCategories.map((category, i) => {
      if (i === index) {
        return { ...category, [e.target.name]: e.target.value };
      }
      return category;
    });
    setTicketCategories(updatedCategories);
  };

  const addTicketCategory = () => {
    setTicketCategories([
      ...ticketCategories,
      { name: "", price: "", totalTickets: "" },
    ]);
  };

  const handleSubmit = async () => {
    // Convert ticketCategories to the format expected by the backend and calculate min_price
    const convertedTicketCategories = ticketCategories.map((cat) => ({
      name: cat.name,
      price: parseFloat(cat.price), // Assuming your backend expects a number
      quantityAvailable: parseInt(cat.totalTickets), // Convert totalTickets to quantityAvailable
      quantityReserved: 0, // Assuming initial value
      quantitySold: 0, // Assuming initial value
    }));

    // Calculate min_price. Ensure we handle the case where prices are empty or invalid.
    const prices = convertedTicketCategories
      .map((cat) => cat.price)
      .filter((price) => !isNaN(price));
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

    const newEvent: Omit<EventData, "comments" | "ticketCategories"> & {
      ticketCategories: typeof convertedTicketCategories;
      min_price: number;
    } = {
      ...eventData,
      ticketCategories: convertedTicketCategories,
      min_price: minPrice, // Add min_price to your event data
    };
    try {
      await createEvent(newEvent); // Use the service function to send the request
      navigate("dashboard");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event"); // Consider using a more user-friendly error handling mechanism
    }
  };



  const calculateTotalTickets = () => {
    return ticketCategories.reduce((acc, category) => {
      return acc + (parseInt(category.totalTickets) || 0);
    }, 0);
  };

  return (
    <Box sx={{ p: 10 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Create New Event
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={eventData.name}
            onChange={handleEventDataChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Category"
            name="category"
            value={eventData.category}
            onChange={handleEventDataChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={eventData.description}
            onChange={handleEventDataChange}
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            label="Organizer"
            name="organizer"
            value={eventData.organizer}
            onChange={handleEventDataChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Image URL"
            name="image"
            value={eventData.image}
            onChange={handleEventDataChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={eventData.location}
            onChange={handleEventDataChange}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Start Date"
            name="startDate"
            type="datetime-local"
            InputLabelProps={{
              shrink: true,
            }}
            value={eventData.startDate}
            onChange={handleEventDataChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="End Date"
            name="endDate"
            type="datetime-local"
            InputLabelProps={{
              shrink: true,
            }}
            value={eventData.endDate}
            onChange={handleEventDataChange}
            margin="normal"
          />
          <Grid item xs={12}>
            <Typography variant="h6">Ticket Categories</Typography>
            {ticketCategories.map((category, index) => (
              <Box
                key={index}
                sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}
              >
                <TextField
                  label="Category Name"
                  name="name"
                  value={category.name}
                  onChange={(e) => handleTicketCategoryChange(index, e)}
                />
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  value={category.price}
                  onChange={(e) => handleTicketCategoryChange(index, e)}
                />
                <TextField
                  label="Total Tickets"
                  name="totalTickets"
                  type="number"
                  value={category.totalTickets}
                  onChange={(e) => handleTicketCategoryChange(index, e)}
                />
              </Box>
            ))}
            <IconButton
              onClick={addTicketCategory}
              color="primary"
              aria-label="add ticket category"
            >
              <AddCircleOutlineIcon />
            </IconButton>
            <Box sx={{ mt: 2 }}>
              <Typography>Total Tickets: {calculateTotalTickets()}</Typography>
            </Box>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button variant="contained" onClick={handleSubmit}>
              Add Event
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewEventPage;
