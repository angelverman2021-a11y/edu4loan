import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { FinderPage } from '@/pages/FinderPage';
import { ComparePage } from '@/pages/ComparePage';
import { CalculatorPage } from '@/pages/CalculatorPage';
import { DocumentsPage } from '@/pages/DocumentsPage';
import { GovtSchemesPage } from '@/pages/GovtSchemesPage';
import { VitBhopalPage } from '@/pages/VitBhopalPage';
import { FaqsPage } from '@/pages/FaqsPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="finder" element={<FinderPage />} />
            <Route path="banks" element={<ComparePage />} />
            <Route path="calculator" element={<CalculatorPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="schemes" element={<GovtSchemesPage />} />
            <Route path="vit-bhopal" element={<VitBhopalPage />} />
            <Route path="faqs" element={<FaqsPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
