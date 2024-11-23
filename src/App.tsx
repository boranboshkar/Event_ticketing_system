import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import LoginForm from "./pages/LoginForm";
import UserApp from "./Apps/UserApp";
import BackofficeApp from "./Apps/BackofficeApp";
import Header from "./components/Header"; // Import the dynamic Header
import { CircularProgress } from "@mui/material";
import { AuthNavigatorContext } from "./contexts/AuthNavigatorContext";
import SignupForm from "./pages/SignUpForm";
function App() {
  const { isAuthenticated, isLoading, userDetails } = useContext(AuthContext);
  const { currentPage } = useContext(AuthNavigatorContext);
  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <>
      <Header />
      {!isAuthenticated ? (
        currentPage === "login" ? (
          <LoginForm />
        ) : (
          <SignupForm />
        )
      ) : userDetails?.permission === "U" ? (
        <UserApp />
      ) : userDetails && ["A", "W"].includes(userDetails?.permission) ? (
        <BackofficeApp />
      ) : (
        <div>
          Access Denied: {userDetails?.username}, {userDetails?.permission}{" "}
        </div>
      )}
    </>
  );
}
export default App;
