import { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  TextField,
  CircularProgress,
  Container,
} from "@mui/material";
import { AuthContext } from '../../contexts/AuthContext'; // Import AuthContext
import { BackofficeNavigatorContext } from "../../contexts/BackofficeNavigatorContext";
import { fetchEventById } from "../../services/eventServices";
import {formatUTCTimeString,formatUTCDateString,formatLocalDateTime} from '../../utils/general'
import { updateEvent } from "../../services/eventServices";
import { queryClient } from "../../queryClient";

const EventDetailsPage = () => {
  const { selectedEventId } = useContext(BackofficeNavigatorContext);
  const {  userDetails } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [eventData, setEventData] = useState({
    startDate: "",
    endDate: "",
  });

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

  useEffect(() => {
    if (event) {
      setEventData({
        startDate: formatLocalDateTime(event.startDate),
        endDate: formatLocalDateTime(event.endDate),
      });
    }
  }, [event]);

  const handleEventDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      if(selectedEventId){
        await updateEvent(selectedEventId, eventData.startDate, eventData.endDate);
        queryClient.invalidateQueries({ queryKey: ["event", selectedEventId] });
        setIsEditing(false);

      }
    } catch (error) {
      console.error('Failed to update the event:', error);    }
  };

  if (isLoading)
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  if (isError || !event)
    return (
      <Typography variant="body1">
        Error: {error?.message || "Event not found"}
      </Typography>
    );
const canEditDate = userDetails?.permission !== 'W'
  return (
    <Box sx={{ p: 10 }}>
      <Typography variant="h4">{event.name}</Typography>
      <Grid container spacing={2} justifyContent="center" alignItems="start">
        <Grid item xs={12} sm={6} md={4}>
          <img
            src={event.image}
            alt={event.name}
            style={{ width: "100%", height: "auto" , borderRadius: "16px" }}
          />
          <Typography variant="body1" sx={{ mt: 2, fontSize: '0.9rem' }}>
            {event.description}
          </Typography>
        </Grid>
        {
        <Grid item xs={12} sm={6} md={8}>
        <Card variant="outlined" sx={{ p: 4, borderRadius: "16px", boxShadow: 1, mb: 2 }}>
          {isEditing ? (
            <>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={eventData.startDate}
                onChange={handleEventDataChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={eventData.endDate}
                onChange={handleEventDataChange}
                margin="normal"
              />
              <Box display="flex" justifyContent="space-around" mt={2}>
                <Button variant="contained" onClick={handleSaveChanges}>
                  Save
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            <>
               <Typography variant="body2">
                {formatUTCDateString(event.startDate) === formatUTCDateString(event.endDate)?formatUTCDateString(event.startDate):
               ( <>
                {formatUTCDateString(event.startDate)} -{" "}
                {formatUTCDateString(event.endDate)}
                </>)}
               </Typography>
              <Typography variant="body2">
                {formatUTCTimeString(event.startDate)} -{" "}
                {formatUTCTimeString(event.endDate)}
              </Typography>
              <Typography variant="body2">{event.location}</Typography>
              {canEditDate && (
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => setIsEditing(true)}
              >
                Edit Event
              </Button>)}
            </>
          )}
        </Card>
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
      </Grid>
        }
        
        <Typography variant="h5">
          Total Comments: {event.comments.length || 0}
        </Typography>
          </Grid>
          <Grid>
        <Typography variant="h5" >
    Categories:
  </Typography>
        <Grid container spacing={2}>
          {event.ticketCategories.map((ticketCategory) => (
            <Grid item xs={12} sm={6} md={4} key={ticketCategory._id}>
              <Grid item>
                <Card
                  variant="outlined"
                  sx={{ p: 2, borderRadius: "16px", boxShadow: 3 }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", fontSize: "2rem" }}
                  >
                    {ticketCategory.name}
                  </Typography>
                  <Typography variant="body2">
                    Price: ${ticketCategory.price}
                  </Typography>
                  <Typography variant="body2">
                    {`${
                      ticketCategory.quantityReserved +
                      ticketCategory.quantitySold
                    }/${ticketCategory.quantityAvailable}`}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          ))}
        </Grid>{" "}
      </Grid>
    </Box>
  );
};

export default EventDetailsPage;
