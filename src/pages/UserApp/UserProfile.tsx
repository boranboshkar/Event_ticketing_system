import {
  Box,
  Paper,
  Button,
  Typography,
  Snackbar,
  IconButton,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import {
  fetchUserOrdersWithEvents,
  RefundOrder,
} from "../../services/orderServices";
import { OrderWithEvent } from "../../types/types";
import { CircularProgress } from "@mui/material";
import { queryClient } from "../../queryClient";
import {formatUTCDateTimeString} from '../../utils/general'

// UserProfile component
const UserProfile = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { userDetails } = useContext(AuthContext);
  const [page, setPage] = useState(1);

  const { data: ordersWithEvents, isLoading } = useQuery({
    queryKey: ["OrdersWithEvents", page],
    queryFn: () => fetchUserOrdersWithEvents(page),
    refetchInterval: 50000,
    retry: 1, // Only retry once upon failure
    refetchOnWindowFocus: true,
    enabled: !!userDetails, // Only run the query if userDetails exist
  });

  const isOrderExpired = (endDate: string) => {
    const eventEndDate = new Date(endDate);
    const currentDate = new Date();
    return currentDate > eventEndDate;
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const refundOrder = async (orderId: string) => {
    try {
      await RefundOrder(orderId);
      await queryClient.invalidateQueries({
        queryKey: ["OrdersWithEvents", page],
      });

      await queryClient.invalidateQueries({
        queryKey: ["ClosestUpcomingEvent"],
      });

      setSnackbarMessage("Order refunded successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Refund error:", error);
      setSnackbarMessage(
        "Something went wrong while refunding the order. Please try again."
      );
      setSnackbarOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <CircularProgress />
      </div>
    );
  }
  const disableNextButton = (ordersWithEvents?.data.length ?? 0) < 6;

  return (
    <Box sx={{ p: 10 }}>
      <Typography variant="h4">Personal Space</Typography>
      <Typography variant="body1">Username: {userDetails?.username}</Typography>
      {ordersWithEvents?.data
        ?.filter(
          (order: OrderWithEvent) =>
            order.status === "Paid" || order.status === "Refunded"
        )
        .slice()
        .sort(
          (a: OrderWithEvent, b: OrderWithEvent) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((order: OrderWithEvent) => (
          <Paper key={order._id} sx={{ p: 2, mb: 2 }}>
            <Typography>Event Name: {order.event.name}</Typography>
            <Typography>Ticket Category: {order.event.ticketCategories.find((category) => category._id === order.ticketCategory)?.name}</Typography>
            <Typography>Quantity: {order.quantity}</Typography>
            <Typography>Status: {order.status}</Typography>
            <Typography>
              Order Date: {formatUTCDateTimeString(order.createdAt)}
            </Typography>
            <Typography>
              {" "}
              Event Date: {formatUTCDateTimeString(order.event.endDate)}
            </Typography>
            {!isOrderExpired(order.event.endDate) && order.status === "Paid" ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => refundOrder(order._id)}
              >
                Refund
              </Button>
            ) : null}
          </Paper>
        ))}
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
            setPage((old) => old + 1);
          }}
          disabled={disableNextButton}
        >
          Next
        </Button>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          action={
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleSnackbarClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </Box>
    </Box>
  );
};
export default UserProfile;
