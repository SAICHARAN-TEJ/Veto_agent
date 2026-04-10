import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import App from './App';
import theme from './theme';

const emotionCache = createCache({ key: 'mui', prepend: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
);
