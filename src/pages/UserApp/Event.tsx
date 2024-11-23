import { useState, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  CircularProgress, Snackbar, IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { UserNavigatorContext } from "../../contexts/UserNavigatorContext";
import {
  fetchEventById,
  addCommentToEvent,
  ReserveTicket,
} from "../../services/eventServices";
import { SelectedTicketCounts } from "../../types/types";
import { CreateOrder } from "../../services/orderServices";
import {formatUTCDateTimeString,formatUTCTimeString} from '../../utils/general'

const EventDetailsPage = () => {
  const { selectedEventId, navigate } = useContext(UserNavigatorContext);
  const [selectedTicketCounts, setSelectedTicketCounts] =
    useState<SelectedTicketCounts>({});
  const [commentText, setCommentText] = useState("");
  const [isReserving, setIsRserving] = useState(false);
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    data: event,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["event", selectedEventId],
    queryFn: () => fetchEventById(selectedEventId!),
    enabled: !!selectedEventId,
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedEventId) return; // Prevent blank comments

    try {
      const { success, message } = await addCommentToEvent(
        selectedEventId,
        commentText
      );
      if (success) {
        // After successfully adding a comment, invalidate the query for the event
        // This triggers a refetch of the event details including the updated comments
        queryClient.invalidateQueries({
          queryKey: ["event", selectedEventId],
        });
        setCommentText(""); // Clear the input field
      } else {
        console.error(message);
        setErrorMessage("something went wrong, please try again");
        setSnackbarOpen(true);
        return
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setErrorMessage("something went wrong, please try again");
      setSnackbarOpen(true);
      return
    }
  };
  // Function to handle the ticket quantity increment and decrement
  const handleTicketChange = (categoryId: string, change: number) => {
    setSelectedTicketCounts((prevCounts) => {
      const newCounts = { ...prevCounts };
      const count = (newCounts[categoryId] || 1) + change;
      newCounts[categoryId] = count < 1 ? 1 : count; // Ensure the count is at least 1
      return newCounts;
    });
  };

  const handleBuyTickets = async (
    ticketCategoryId: string,
    ticketCategoryName: string
  ) => {
    try{
    setIsRserving(true);
    const quantity = selectedTicketCounts[ticketCategoryId] || 1;
    const pricePerTicket =
      event?.ticketCategories.find((tc) => tc._id === ticketCategoryId)
        ?.price || 0;
    const total = pricePerTicket * quantity;
    if (selectedEventId) {
      await ReserveTicket(selectedEventId,ticketCategoryId , quantity);
    }
    const order = selectedEventId
      ? await CreateOrder(selectedEventId, ticketCategoryId, quantity, total)
      : null;
    if (order) {
      // Prepare the checkout details
      const checkoutDetails = {
        orderId: order._id,
        eventId: order.eventId,
        eventName: event?.name,
        categoryId: order.ticketCategory,
        categoryName: ticketCategoryName,
        quantity: order.quantity,
        pricePerTicket: pricePerTicket,
      };

          navigate("checkout", checkoutDetails);
          setIsRserving(false);
      
    
    }
   }
    catch (error) {
      setIsRserving(false);
      console.error("Error buying tickets:", error);
      setErrorMessage("something went wrong, please try again");
      setSnackbarOpen(true);
      return;
    }
    
  };

  if (isLoading ||isReserving)
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <CircularProgress />
      </div>
    );
  if (isError || !event)
    return (
      <Typography variant="body1">
        Error: {error?.message || "Event not found"}
      </Typography>
    );

  return (

    <Box sx={{ p: 4 }}>
    {/* Event Name */}
    <Typography variant="h4"  sx={{ mb: 2 }}>
      {event.name}
    </Typography>
  
    {/* Main Event Details Container */}
    <Grid container justifyContent="space-around" alignItems="start" spacing={2}>
      {/* Event Image */}
      <Grid item md={6}>
        <Box sx={{ maxWidth: 500, width: "100%", mb: 2 }}> {/* Adjust width as needed, remove mb if needed */}
          <img
            src={event.image}
            alt={event.name}
            style={{ width: "350px", maxHeight:"350px", borderRadius: "16px", display: "block" }}
          />
          <Typography variant="body1" sx={{ mt: 2, fontSize: '0.9rem' }}>
            {event.description}
          </Typography>
        </Box>
      </Grid>

    {/* Event Details */}
    <Grid item md={6}>
  <Box>
    {/* Event Category and Pricing */}
    <Card variant="outlined" sx={{ p: 4, borderRadius: "16px", boxShadow: 1, mb: 2 }}>
      <Typography variant="body2">
        {event.category} event
      </Typography>
      <Typography variant="body2">
        From {event.min_price}$
      </Typography>
      <Typography variant="body2">
        {event.ticketCategories.reduce(
          (total, category) => total + category.quantityAvailable,
          0
        )}{" "}
        Tickets available
      </Typography>
    </Card>
    {/* Event Date and Location */}
    <Card variant="outlined" sx={{ p: 4, borderRadius: "16px", boxShadow: 1 }}>
      <Typography variant="body2">
        {formatUTCDateTimeString(event.startDate)}
      </Typography>
      <Typography variant="body2">
        {formatUTCTimeString(event.startDate)} -{" "}
        {formatUTCTimeString(event.endDate)}
      </Typography>
      <Typography variant="body2">{event.location}</Typography>
    </Card>
  </Box>
</Grid>
</Grid> 

  {/* Buy Tickets Section */}
  <Typography variant="h6" sx={{ mt: 3, fontSize: '1rem' }}>
    Buy Tickets:
  </Typography>
  <Grid container spacing={0.5} >
  {event.ticketCategories.map((ticketCategory) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={ticketCategory._id} sx={{ padding: 0 }}>
      <Card sx={{ minWidth: 200, maxWidth: 400, m: 1, display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {ticketCategory.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: ${ticketCategory.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tickets Left: {ticketCategory.quantityAvailable - ticketCategory.quantityReserved}
          </Typography>
        </CardContent>
        <CardActions sx={{ padding: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton aria-label="decrease ticket count" onClick={() => handleTicketChange(ticketCategory._id, -1)} size="small">
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" sx={{ marginX: 1 }}>
              {selectedTicketCounts[ticketCategory._id] || 1}
            </Typography>
            <IconButton aria-label="increase ticket count" onClick={() => handleTicketChange(ticketCategory._id, 1)} size="small">
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
          <Button variant="contained" size="small" onClick={() => handleBuyTickets(ticketCategory._id, ticketCategory.name)}>
            Buy Now
          </Button>
        </CardActions>

      </Card>
    </Grid>
  ))}
</Grid>

  {/* Comments Section */}
  <Typography variant="h6" sx={{ mt: 3, fontSize: '1rem' }}>
    Comments:
  </Typography>
  {event.comments.map((comment) => (
    // ... Your existing comment JSX ...
     <Box key={comment._id} sx={{ my: 1 }}>
          <Typography variant="body2">
            {comment.username
              ? ` By:${comment.username}`
              : ` By the user id is:${comment.user}`}
            : {`At:${formatUTCDateTimeString(comment.date)}`}
          </Typography>
          <Typography variant="body1">{comment.content}</Typography>
        </Box>
  ))}

  {/* Add Comment Section */}
  <Box sx={{ mt: 2 }}>
  <TextField
    placeholder="Add a comment..."
    value={commentText}
    onChange={(e) => setCommentText(e.target.value)}
    variant="outlined"
    sx={{ mb: 2 }} // Margin bottom to push the button down
  />
  <Button
    variant="contained"
    onClick={handleAddComment}
    sx={{ display: 'block', mt: 1 }} // Display block to make it a block-level element
  >
    Post Comment
  </Button>
</Box>

      <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleSnackbarClose}
      message={errorMessage}
      action={
        <Button color="inherit" size="small" onClick={handleSnackbarClose}>
          Close
        </Button>
      }
    />
</Box>

  );
};

export default EventDetailsPage;
