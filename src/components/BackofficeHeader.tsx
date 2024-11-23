import { useContext } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box,Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import for the go back button
// import DashboardIcon from '@mui/icons-material/Dashboard'; // Icon for Dashboard
import { BackofficeNavigatorContext } from '../contexts/BackofficeNavigatorContext'; // Context for navigation in backoffice
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Logout icon
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home'; // Home icon for Catalog
import {queryClient} from '../queryClient'
const BackofficeHeader = () => {
  const { goBack, historyStack, navigate ,resetNavigator} = useContext(BackofficeNavigatorContext);
  const { logout, userDetails } = useContext(AuthContext);
  // Condition to show go back button
  const showGoBack = historyStack && historyStack.length > 0;
  // Handle navigation to the NewEvent page
  const handleAddEventClick = () => {
    navigate('newEvent');
  };
      // Function to handle logout
      const handleLogout = () => {
        logout();
        queryClient.clear()
        resetNavigator();
      };
  return (
    <AppBar position="fixed">
      <Toolbar>
        {showGoBack && (
          <IconButton color="inherit" onClick={goBack} sx={{ marginRight: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Box sx={{ flexGrow: 1, display: 'flex',alignItems: 'center' }}>
          <IconButton color="inherit" onClick={() => navigate('dashboard')}>
            <HomeIcon />
          </IconButton>
          <Typography variant="h6">Backoffice Dashboard</Typography>

        </Box>
        {userDetails?.permission === 'A' && (
            <Button color="inherit" onClick={handleAddEventClick}>
              <AddIcon />
              Add Event
            </Button>
          )}
      <Button color="inherit" onClick={handleLogout}>
          <ExitToAppIcon />
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default BackofficeHeader;
