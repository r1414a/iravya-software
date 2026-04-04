import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'leaflet/dist/leaflet.css';
import { RouterProvider } from 'react-router-dom'
import router from './router.jsx'
import { Provider } from 'react-redux';
import { store } from './lib/store';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <Toaster position="top-right" />
        <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
