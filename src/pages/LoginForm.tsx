
import React, { useState, useContext } from 'react';
import { Button, TextField, Container, Typography, Grid , IconButton, InputAdornment , Alert} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AuthContext } from '../contexts/AuthContext'; 
import { AuthNavigatorContext } from '../contexts/AuthNavigatorContext';
import { getUserProfile,login } from '../services/authServices';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { setIsAuthenticated, setUserDetails } = useContext(AuthContext); // Use AuthContext for authentication
    const { navigate } = useContext(AuthNavigatorContext); // Use AuthNavigatorContext for navigation

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!username.trim() || !password.trim()) {
            setErrorMessage('Please fill in both username and password');
            return;
        }
        try {
            await login(username.trim(), password )
            const userProfileResponse = await getUserProfile()
            setIsAuthenticated(true); // Set authentication status using AuthContext
            setUserDetails(userProfileResponse); // Set user details using AuthContext
            setErrorMessage(''); 
        } catch (error) {
            console.error('Login error:', error);
                switch ((error as any).status) {
                    case 400:
                        setErrorMessage('Invalid Username, please try again');
                        break;
                    case 401:
                        setErrorMessage('The username or the password is incorrect');
                        break;
                    case 500:
                        setErrorMessage('Something went wrong, please try again');
                        break;
                    default:
                        setErrorMessage('An unexpected error occurred, please try again');
                }
            
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container sx={{ p: 10 }}  maxWidth="xs">
            <Typography variant="h4" component="h1" gutterBottom>Login</Typography>
            <form onSubmit={handleSubmit}>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                <TextField
                    label="Username"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    
                />
                <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}  
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={togglePasswordVisibility}
                                    edge="end"
                                    size="small"
                                >
                                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Button onClick={() => navigate('signup')} color="primary">
                            Don't have an account? Sign Up
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default LoginForm;
