import React from 'react';
import Box from '@mui/material/Box';
import { SupportConsole } from './components/SupportConsole';

function App() {
  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'background.default',
        backgroundImage:
          'radial-gradient(circle at 12% 8%, rgba(196,149,106,0.15) 0%, rgba(196,149,106,0) 36%), radial-gradient(circle at 88% 92%, rgba(76,175,125,0.12) 0%, rgba(76,175,125,0) 34%), linear-gradient(180deg, #0b0f15 0%, #0f141d 100%)',
      }}
    >
      <SupportConsole />
    </Box>
  );
}

export default App;
