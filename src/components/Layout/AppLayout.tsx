import { useState } from "react";
import { Outlet } from "react-router-dom";
import MainNavbar from "../ui/MainNavbar";
import { getAskTheme } from "../../features/ask/constants/theme"; 

export default function AppLayout() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Check if dark mode to know which theme to render
  const theme = getAskTheme(isDarkMode);

  // Toggle function to flip the state
  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: theme.bg, color: theme.textPrimary }}
    >
      <MainNavbar 
        NavTheme={theme} 
        isDarkMode={isDarkMode} 
        onToggleTheme={handleToggleTheme} 
      />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 w-full max-w-7xl mx-auto p-6">
          <Outlet context={{ isDarkMode }}/>
        </div>
      </main>
    </div>
  );
}