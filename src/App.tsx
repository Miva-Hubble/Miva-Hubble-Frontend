import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { AppRoutes } from "./routes";
// import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* <ThemeProvider> */}
        <AppRoutes />
        {/* </ThemeProvider> */}
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;