import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import App from './App';
import Navbar from './components/Navbar/Navbar';
import { AuthProvider } from './authContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Router should wrap everything */}
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <AuthProvider>
          
          <Navbar />
          <App />
        </AuthProvider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);
