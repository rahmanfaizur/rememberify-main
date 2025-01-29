import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
    isDark: false,
    toggleTheme: () => {}
});

export function ThemeProvider({props} : any) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setIsDark(savedTheme === 'dark');
        } else {
            //system preference
            const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(systemIsDark);
        }
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        //save prefence to localStorage!
        localStorage.setItem('theme', !isDark ? 'dark' : 'light');
    }

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
          {props}
        </ThemeContext.Provider>
      );
    }
    
    // Custom hook for easy access to theme context
    export const useTheme = () => useContext(ThemeContext);