import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#E8FF00',
      light: '#F0FF55',
      dark: '#C8E000',
      contrastText: '#0C0C0C',
    },
    secondary: {
      main: '#38BDF8',
      light: '#7DD3FC',
      dark: '#0284C7',
      contrastText: '#030711',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    info: {
      main: '#38BDF8',
      light: '#7DD3FC',
      dark: '#0284C7',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
      disabled: '#475569',
    },
    background: {
      default: '#0C0C0C',
      paper: '#111111',
    },
    divider: 'rgba(148, 163, 184, 0.1)',
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#1F2937',
      800: '#111827',
      900: '#0A1120',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontFamily: "'Sora', sans-serif",
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.12,
      letterSpacing: '-0.035em',
    },
    h2: {
      fontFamily: "'Sora', sans-serif",
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontFamily: "'Sora', sans-serif",
      fontWeight: 700,
      fontSize: '1.25rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontFamily: "'Sora', sans-serif",
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.35,
    },
    h5: {
      fontFamily: "'Sora', sans-serif",
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: "'Sora', sans-serif",
      fontWeight: 600,
      fontSize: '0.75rem',
      lineHeight: 1.45,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.65,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.55,
    },
    caption: {
      fontSize: '0.6875rem',
      lineHeight: 1.45,
      letterSpacing: '0.04em',
      fontWeight: 500,
    },
    overline: {
      fontSize: '0.625rem',
      lineHeight: 1.5,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      fontWeight: 700,
    },
    button: {
      fontFamily: "'Sora', sans-serif",
      fontSize: '0.8125rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    fontFamilyMonospace: "'IBM Plex Mono', monospace",
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingInline: 18,
          paddingBlock: 10,
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          background: '#0A1120',
        },
      },
    },
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.4)',
    '0 2px 6px rgba(0,0,0,0.45)',
    '0 4px 12px rgba(0,0,0,0.5)',
    '0 8px 20px rgba(0,0,0,0.5)',
    '0 12px 28px rgba(0,0,0,0.55)',
    '0 16px 36px rgba(0,0,0,0.55)',
    '0 20px 44px rgba(0,0,0,0.6)',
    '0 24px 52px rgba(0,0,0,0.6)',
    '0 28px 60px rgba(0,0,0,0.65)',
    ...Array(15).fill('0 28px 60px rgba(0,0,0,0.65)'),
  ],
});

export default theme;
