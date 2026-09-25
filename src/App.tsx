import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./hooks/useAuth";
import { ToastProvider } from "./components/feedback/ToastProvider";
import { AppRoutes } from "./routes";
import { queryClient } from "./lib/queryClient";
// import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            {/* <ThemeProvider> */}
            <AppRoutes />
            {/* </ThemeProvider> */}
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;