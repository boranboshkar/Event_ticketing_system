import React from "react";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { UserNavigatorContext } from "../../contexts/UserNavigatorContext";
import { CircularProgress } from "@mui/material";
import { fetchEvents } from "../../services/eventServices";
import { Event } from "../../types/types";
import {formatUTCDateTimeString} from '../../utils/general'

//TODO: add check if there are no tickets availabe in all the events show a relevant message(sold out)
// if there are no ticket availabe for an event do not show it.

const CatalogPage = () => {
  const { navigate } = useContext(UserNavigatorContext);
  const [page, setPage] = React.useState(1);
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["events", page],
    queryFn: () => fetchEvents(page),
  });
  const handleEventClick = (eventId: string) => {
    navigate("event", { selectedEventId: eventId });
  };
  if (isLoading)
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <CircularProgress />
      </div>
    );
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <Box sx={{ p: 10 }}>
      <Typography variant="h4" gutterBottom>
        Catalog
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {data?.data?.map((event: Event) => (
          <Card
            key={event._id}
            sx={{ width: 345, cursor: "pointer" }}
            onClick={() => handleEventClick(event._id)}
          >
            <CardMedia
              component="img"
              height="140"
              image={event.image || "/placeholder-image.png"}
              alt={event.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {event.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatUTCDateTimeString(event.startDate)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {event.category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Starting from ${event.min_price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <div>
                  {event.ticketCategories.reduce(
                    (total, category) => total + category.quantityAvailable,
                    0
                  )}{" "}
                  Tickets Available
                </div>
              </Typography>
            </CardContent>
          </Card>
        )) ?? <div>No events to display</div>}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Typography sx={{ margin: "0 10px", lineHeight: "36px" }}>
          {page}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            if (!data || page >= Math.ceil(data.total / 5)) return;
            setPage((old) => old + 1);
          }}
          disabled={data && page >= Math.ceil(data.total / 5)}
        >
          Next
        </Button>
      </Box>
    </Box>
    
  );
};

export default CatalogPage;
