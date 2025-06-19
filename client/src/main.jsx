import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import App from './App';
import Navbar from './components/Navbar/Navbar';
import { AuthProvider } from './authContext';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Footer from './components/Footer/Footer';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // how long fresh data stays valid (in ms)
      staleTime: 1000 * 60,       // 1 minute
      // how many ms to keep unused data in cache
      cacheTime: 1000 * 60 * 5,   // 5 minutes
      // retry failed requests once
      retry: 1,
    },
  },
});
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter> {/* Router should wrap everything */}
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <AuthProvider>

          <Navbar />
          <App />
          <Footer />
          <WhatsAppButton />

        </AuthProvider>
      </MantineProvider>
    </BrowserRouter>
  </QueryClientProvider>
  </React.StrictMode >
);
