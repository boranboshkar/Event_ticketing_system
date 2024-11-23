import  { useContext } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // For the go back button
import HomeIcon from '@mui/icons-material/Home'; // Home icon for Catalog
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // User icon for Profile
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Logout icon
import { UserNavigatorContext } from '../contexts/UserNavigatorContext'; // Assuming this is the correct context for user navigation
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext
import  {fetchClosestUpcomingEvent}  from '../services/orderServices';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress } from "@mui/material";
import {queryClient} from '../queryClient'
import {formatUTCDateTimeString} from '../utils/general'

// TODO: add the next event to the current user on the header and keep it syncronized with the db.(it should be changed once the user buys a new ticket/s)
const UserHeader = () => {
  const { navigate, goBack, currentPage, historyStack,resetNavigator} = useContext(UserNavigatorContext);
  const { logout,userDetails } = useContext(AuthContext);


  // Show goBack button based on specific conditions
  const showGoBack = currentPage === 'event' || currentPage === 'checkout' || (historyStack.length > 0 && !(currentPage === 'catalog' || currentPage === 'profile'));
  const username = userDetails?.username
  
  const { data: closestUpcomingEvent, isLoading } = useQuery({
    queryKey: ['ClosestUpcomingEvent'],
    queryFn:  () => fetchClosestUpcomingEvent(),
    initialData: null,
    // enabled:!!Cookies.get("token")
  });

    const handleLogout = () => {
      logout();
      queryClient.clear()
      resetNavigator();
    };
  return (
    <AppBar position="fixed">
      <Toolbar>
        {/* Conditionally render the Go Back button */}
        {showGoBack && (
          <IconButton color="inherit" onClick={goBack} sx={{ marginRight: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {/* Icons for navigating to main user sections */}
          <IconButton color="inherit" onClick={() => navigate('catalog')}>
            <HomeIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('profile')}>
            <AccountCircleIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome, {username} 
          </Typography>
          
          {isLoading ? (
            <CircularProgress color="inherit" size={24} />
            // <></>
          ) : closestUpcomingEvent ? (
            <Typography variant="body1" sx={{ ml: 2 }}>
              Next event: {closestUpcomingEvent.event.name} at {formatUTCDateTimeString(closestUpcomingEvent.event.startDate)}
            </Typography>
          ) : null}

        </Box>
        {/* Logout Button */}
        <Button color="inherit" onClick={handleLogout}>
          <ExitToAppIcon />
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default UserHeader;
