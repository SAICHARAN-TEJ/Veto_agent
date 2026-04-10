import React from 'react';
import Box from '@mui/material/Box';
import { SupportConsole } from './components/SupportConsole';

function App() {
  return (
    <Box sx={{ height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
      <SupportConsole />
    </Box>
  );
}

export default App;
