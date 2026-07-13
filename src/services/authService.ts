import axios from 'axios';

// Telling Axios to attach the cookie to every request
axios.defaults.withCredentials = true;

const BASE_URL = import.meta.env.VITE_API_URL;
const AUTH_URL = `${BASE_URL}/api/auth/google`;

export const authService = {
    initiateAuth: async () => {
        try {
            const response = await axios.get(AUTH_URL);
            if (response.data.success && response.data.authUrl) {
                window.location.href = response.data.authUrl; 
            } else {
                console.error("No URL provided");
            }
        } catch (error) {
            console.error("Failed to connect to auth server:", error);
        }
    },
    
    logout: async () => {
        window.location.href = "/";
    }
};