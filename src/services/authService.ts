import axios from 'axios'; 

const BASE_URL = import.meta.env.VITE_API_URL;
const AUTH_URL = `${BASE_URL}/api/auth/google`;

export const authService = {
    // Both Login and Signup use the same flow
    initiateAuth: async () => {
        try {            
            const response = await axios.get(AUTH_URL);
            
            // Axios automatically parses the JSON 
            const data = response.data;

            // Redirect the user to Google's screen
            if (data.success && data.authUrl) {
                window.location.href = data.authUrl; 
            } else {
                console.error("Backend didn't provide an auth URL:", data);
            }
        } catch (error) {
            console.error("Failed to connect to auth server:", error);
        }
    },

    // Catch the token from the URL and save it
    saveAuthData: (token: string) => {
        if (token) {
            localStorage.setItem("userToken", token);
        }
    },

    // Log Out Function
    logout: () => {
        localStorage.removeItem("userToken");
        window.location.href = "/";
    },

    // Check if user is currently logged in
    isLoggedIn: (): boolean => {
        return !!localStorage.getItem("userToken");
    }
};