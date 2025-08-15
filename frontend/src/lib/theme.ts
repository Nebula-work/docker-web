import {createTheme} from "@mantine/core";

export const theme = createTheme({
    primaryColor: 'blue',
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    colors: {
        dark: [
            '#C9C9C9', // 0: light gray
            '#B8B8B8', // 1:
            '#A4A4A4', // 2:
            '#909090', // 3:
            '#7C7C7C', // 4:
            '#686868', // 5:
            '#545454', // 6:
            '#404040', // 7:
            '#2C2C2C', // 8:
            '#1A1A1A', // 9: darkest
        ],
        blue: [
            '#e0f3ff', // 0: lightest
            '#b3d9ff', // 1:
            '#80bfff', // 2:
            '#4da6ff', // 3:
            '#1a8cff', // 4:
            '#0073e6', // 5: default
            '#005bb3', // 6:
            '#004080', // 7:
            '#00264d', // 8:
            '#000d1a', // 9: darkest
        ],
    },
    other: {
        // Docker theme colors
        background: 'hsl(218, 23%, 6%)',
        foreground: 'hsl(210, 40%, 98%)',
        primary: 'hsl(195, 95%, 50%)',
        primaryForeground: 'hsl(220, 24%, 8%)',
        card: 'hsl(220, 24%, 8%)',
        cardForeground: 'hsl(210, 40%, 98%)',
        border: 'hsl(218, 20%, 18%)',
        muted: 'hsl(218, 20%, 12%)',
        mutedForeground: 'hsl(215, 20%, 65%)',
    }
});