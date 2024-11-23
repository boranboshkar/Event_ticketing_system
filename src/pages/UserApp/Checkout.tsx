import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  LinearProgress,
  Alert,
} from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { UserNavigatorContext } from "../../contexts/UserNavigatorContext";
import { CheckoutPageProps } from "../../types/types";
import { ReleaseTicket } from "../../services/eventServices";
import { PayTheOrder } from "../../services/orderServices";
import { queryClient } from "../../queryClient";

const CheckoutPage: React.FC<CheckoutPageProps> = ({ checkoutDetails }) => {
  const { navigate } = useContext(UserNavigatorContext);
  const { eventName, categoryName, quantity, pricePerTicket } = checkoutDetails;
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [timeIsUp, setTimeIsUp] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    cc: "",
    holder: "",
    cvv: "",
    exp: "",
  });
  const [formData, setFormData] = useState({
    cc: "",
    holder: "",
    cvv: "",
    exp: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  useEffect(() => {
    let tmp = 0;
    if (!timeIsUp) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // When countdown reaches zero
            clearInterval(timer);
            setTimeIsUp(true);
            setOpenSnackbar(true);
            tmp = timer;
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      // This will run only when timeIsUp becomes true
      setOpenSnackbar(true);
      setErrorMessage("Time is up! Releasing your tickets.");
      ReleaseTicket(
        checkoutDetails.eventId,
        checkoutDetails.categoryId,
        checkoutDetails.quantity
      )
        .then(() => {
          console.log("Tickets released successfully");
        })
        .catch((error) => {
          console.error("Failed to release tickets:", error);
        });

      setTimeout(() => {
        navigate("catalog");
      }, 4000);
    }
    return () => {
      if (tmp) clearInterval(tmp);
    };
  }, [timeIsUp, navigate, checkoutDetails]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const validateForm = () => {
    let errors = { cc: "", holder: "", cvv: "", exp: "" };
    let isValid = true;
    if (!formData.cc.trim()) {
      errors.cc = "Credit card number is required";
      isValid = false;
    } else {
      if (!/^\d{16}$/.test(formData.cc)) {
        errors.cc = "Credit card number must be 16 digits";
        isValid = false;
      }
    }
    if (!formData.holder.trim()) {
      errors.holder = "Card holder name is required";
      isValid = false;
    }
    if (!formData.cvv.trim()) {
      errors.cvv = "CVV is required";
      isValid = false;
    } else {
      if (!/^\d{3}$/.test(formData.cvv)) {
        errors.cvv = "CVV must be 3 digits";
        isValid = false;
      }
    }
    if (!formData.exp.trim()) {
      errors.exp = "Expiration date is required";
      isValid = false;
    } else {
      if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.exp)) {
        errors.exp = "Expiration date must be in MM/YY format";
        isValid = false;
      } else {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100; // Last two digits of the year
        const currentMonth = currentDate.getMonth() + 1; // Month is 0-indexed
        const [expMonth, expYear] = formData.exp.split("/").map(Number);
        if (
          expYear < currentYear ||
          (expYear === currentYear && expMonth < currentMonth)
        ) {
          errors.exp = "Expiration date must be in the future";
          isValid = false;
        }
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleBuyNow = async () => {
    if (timeIsUp) {
      setOpenSnackbar(true);
      return;
    }
    const isFormValid = validateForm();
    if (!isFormValid) return;
    setIsLoading(true);
    try {
      const paymentResult = await PayTheOrder(
        checkoutDetails.orderId,
        formData,
        quantity,
        pricePerTicket
      );
      if (paymentResult.success === true) {
        queryClient.invalidateQueries({ queryKey: ["ClosestUpcomingEvent"] });
        navigate("Success", checkoutDetails);
      } else {
        setErrorMessage("Payment failed, please try again.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 600, margin: "auto", mt: 4 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="div">
            Order Summary
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontSize: 14 }} color="body2" gutterBottom>
              Event: {eventName}
            </Typography>
            <Typography variant="body2">
              Date: {new Date().toLocaleDateString()}
            </Typography>
            <Typography variant="body2">
              {quantity} x {categoryName}
            </Typography>
            <Typography variant="body2">
              Total: ${quantity * pricePerTicket}
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField
                required
                error={!!formErrors.holder}
                helperText={formErrors.holder}
                label="Card holder name"
                name="holder"
                value={formData.holder}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Credit card number"
                error={!!formErrors.cc}
                helperText={formErrors.cc}
                name="cc"
                value={formData.cc}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label="CVV"
                error={!!formErrors.cvv}
                helperText={formErrors.cvv}
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                defaultValue=""
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label="Expiration date (MM/YY)"
                error={!!formErrors.exp}
                helperText={formErrors.exp}
                name="exp"
                value={formData.exp}
                onChange={handleChange}
                defaultValue=""
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2">
              Expiration Time: {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(timeLeft / 120) * 100}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleBuyNow}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Buy Now"}
            </Button>
          </Box>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="error"
              sx={{ width: "100%" }}
            >
              {errorMessage ||
                "2 minutes have passed. Please restart the transaction."}
            </Alert>
          </Snackbar>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CheckoutPage;
