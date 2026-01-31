import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App.tsx';
import AuthInitializer from './components/providers/AuthInitializer.tsx';
import { Toaster } from './components/ui/sonner.tsx';
import { ThemeProvider } from './context/theme-provider.tsx';
import './index.css';
import { queryClient } from './lib/react-query/queryClient.ts';
import store from './store/store.ts';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          <App />
        </AuthInitializer>
        <Toaster richColors closeButton />
      </QueryClientProvider>
    </Provider>
  </ThemeProvider>
);
