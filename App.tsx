
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Services } from './pages/Services';
import { Transactions } from './pages/Transactions';
import { Reports } from './pages/Reports';
import { seedInitialData } from './services/storage';

const App: React.FC = () => {
  useEffect(() => {
    // Ensure initial services are available on first load
    seedInitialData();
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
