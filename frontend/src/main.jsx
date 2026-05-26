import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './index.css';

import {
  Toaster
} from 'react-hot-toast';

ReactDOM.createRoot(
  document.getElementById('root')
).render(

  <React.StrictMode>

    {/* APP */}
    <App />

    {/* TOASTS GLOBALES */}
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,

        style: {
          background: '#0f172a',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '14px 18px'
        },

        success: {
          iconTheme: {
            primary: '#06b6d4',
            secondary: '#ffffff'
          }
        },

        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff'
          }
        }
      }}
    />

  </React.StrictMode>
);