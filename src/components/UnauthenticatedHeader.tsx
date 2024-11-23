import { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { AuthNavigatorContext } from "../contexts/AuthNavigatorContext";

const UnauthenticatedHeader = () => {
  const { currentPage, navigate } = useContext(AuthNavigatorContext);

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Box
          sx={{ flexGrow: 1, display: "flex", justifyContent: "space-between" }}
        >
          <Typography variant="h6">Events & Tickets</Typography>
          {/* <div> */}
          {currentPage === "signup" ? (
            <Button color="inherit" onClick={() => navigate("login")}>
              Login
            </Button>
          ) : (
            <Button color="inherit" onClick={() => navigate("signup")}>
              Signup
            </Button>
          )}
          {/* </div> */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default UnauthenticatedHeader;
