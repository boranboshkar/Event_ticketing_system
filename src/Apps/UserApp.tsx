import { useContext } from "react";
import { UserNavigatorContext } from "../contexts/UserNavigatorContext";
import UserProfile from "../pages/UserApp/UserProfile";
import Header from "../components/Header";
import CatalogPage from "../pages/UserApp/Catalog";
import { CircularProgress, Fade, Box } from "@mui/material";
import EventDetailsPage from "../pages/UserApp/Event";
import CheckoutPage from "../pages/UserApp/Checkout";
import SuccessPage from "../pages/UserApp/SuccessPage";
import React from "react";
import ForwardRefWrapper from '../components/ForwardRefWrapper';
import { AuthContext } from "../contexts/AuthContext";

function UserApp() {
  const { currentPage, checkoutDetails } = useContext(UserNavigatorContext);
  const {isLoading} = useContext(AuthContext)

  let PageComponent = <React.Fragment />;
  switch (currentPage) {
    case "catalog":
      PageComponent = <CatalogPage />;
      break;
    case "profile":
      PageComponent = <UserProfile />;
      break;
    case "event":
      PageComponent = <EventDetailsPage />;
      break;
    case "checkout":
      PageComponent = checkoutDetails ? <CheckoutPage checkoutDetails={checkoutDetails} /> : <></>;
      break;
    case "Success":
      PageComponent = checkoutDetails ? (
          <SuccessPage checkoutDetails={checkoutDetails} />
        ) : <></>
        break;
    default:
      PageComponent = <CatalogPage />;
  }

  return (
    <>
      <Header />
      <Box sx={{ pt: 10 }}>
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <CircularProgress />
          </div>
        ) : (
          <Fade in={!isLoading} timeout={500}>
            <ForwardRefWrapper>
                {PageComponent}
            </ForwardRefWrapper>
          </Fade>
        )}
      </Box>
    </>
  );
}

export default UserApp;
