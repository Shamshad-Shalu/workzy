import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import store from './store/store.ts';
import { Toaster } from 'sonner';
import { registerAuthHandlers } from './lib/api/axios.ts';
import { clearUser, updateToken } from './store/slices/authSlice.ts';

const queryClient = new QueryClient({});

registerAuthHandlers(
  newToken => store.dispatch(updateToken(newToken)),
  () => store.dispatch(clearUser())
);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster richColors closeButton />
    </QueryClientProvider>
  </Provider>
);
