import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ComparisonProvider } from '@/context/ComparisonContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { LoansPage } from '@/pages/LoansPage';
import { SchemeDetailPage } from '@/pages/SchemeDetailPage';
import { ComparePage } from '@/pages/ComparePage';
import { CalculatorPage } from '@/pages/CalculatorPage';
import { DocumentsPage } from '@/pages/DocumentsPage';
import { GovtSchemesPage } from '@/pages/GovtSchemesPage';
import { VitBhopalPage } from '@/pages/VitBhopalPage';
import { FaqsPage } from '@/pages/FaqsPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ApplicationTrackerPage } from '@/pages/ApplicationTrackerPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ComparisonProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="tracker" element={<ApplicationTrackerPage />} />
              <Route path="loans" element={<LoansPage />} />
              <Route path="loans/:id" element={<SchemeDetailPage />} />
              <Route path="finder" element={<LoansPage />} />
              <Route path="compare" element={<ComparePage />} />
              <Route path="banks" element={<LoansPage />} />
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
      </ComparisonProvider>
    </AuthProvider>
  );
};

export default App;
