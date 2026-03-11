import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#1a1a1a', // Main text
        },
        secondary: {
            main: '#4caf50', // Secondary sub color if we need it
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
        h1: {
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
            // We can even define responsive sizes globally here!
        },
    },
});

