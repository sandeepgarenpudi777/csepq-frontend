import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="page-wrapper">
        <Navbar />
        <main className="main-content" style={{ paddingTop: 72 }}>
          <AppRoutes />
        </main>
        <Footer />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            borderRadius: '10px',
            background: '#0d0f14',
            color: '#fff',
            padding: '12px 16px',
            boxShadow: '0 8px 32px rgba(13,15,20,0.25)',
          },
          success: {
            iconTheme: { primary: '#e8a020', secondary: '#0d0f14' },
          },
          error: {
            iconTheme: { primary: '#c94040', secondary: '#fff' },
          },
        }}
      />
    </BrowserRouter>
  );
}
