import { useState, useEffect } from 'react';

export function useGreeting(username: string = '') {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const currentHour = new Date().getHours();
      
      let timeGreeting = "Welcome";
      if (currentHour >= 0 && currentHour < 12) {
        timeGreeting = "Good morning";
      } else if (currentHour >= 12 && currentHour < 17) {
        timeGreeting = "Good afternoon";
      } else if (currentHour >= 17 && currentHour <= 23) {
        timeGreeting = "Good evening";
      }
      
      return username ? `${timeGreeting}, ${username}` : timeGreeting;
    };

    setGreeting(getGreeting());
    
    // Optional: Update greeting periodically if the user leaves the page open
    const intervalId = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [username]);

  return greeting;
}
