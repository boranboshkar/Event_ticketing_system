// SuccessPage.tsx
import { useContext } from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { UserNavigatorContext } from "../../contexts/UserNavigatorContext";
import { CheckoutPageProps } from "../../types/types";

const SuccessPage: React.FC<CheckoutPageProps> = ({ checkoutDetails }) => {
  const { navigate } = useContext(UserNavigatorContext);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start", // Align to the top
        pt: "64px", // Adds padding at the top of the container
        height: "calc(100vh - 64px)", // Adjust height to account for padding
      }}
    >
      <Card
        sx={{
          maxWidth: "600px", // Increased width
          width: "90%", // Use more of the viewport width
          bgcolor: "#C8E6C9", // Light green background
          my: 2, // Adds margin at the top and bottom
        }}
      >
        <CardContent sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h5" gutterBottom component="div">
            Congratulations! Enjoy!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>orderId:</strong> {checkoutDetails.orderId}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>{checkoutDetails.eventName}</strong>
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>{checkoutDetails.quantity}</strong> x{" "}
            <strong>{checkoutDetails.categoryName}</strong>
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Total:{" "}
            <strong>
              ${checkoutDetails.quantity * checkoutDetails.pricePerTicket}
            </strong>
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#A5D6A7", // Slightly darker green for the button
              "&:hover": {
                bgcolor: "#81C784", // Even darker green on hover
              },
              borderRadius: "20px", // Rounded corners for the button
              px: 3, // Horizontal padding for the button
              py: 1, // Vertical padding for the button
            }}
            onClick={() => navigate("catalog")}
          >
            Go Back To The Events Catalog
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SuccessPage;
