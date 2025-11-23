import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import store from './store/store.ts';
import { registerAuthHandlers } from './lib/api/axios.ts';
import { clearUser, updateToken } from './store/slices/authSlice.ts';
import AuthInitializer from './components/providers/AuthInitializer.tsx';
import { ThemeProvider } from './context/theme-provider.tsx';
import { Toaster } from './components/ui/sonner.tsx';

const queryClient = new QueryClient({});

registerAuthHandlers(
  newToken => store.dispatch(updateToken(newToken)),
  () => store.dispatch(clearUser())
);

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
