import React from 'react';
import { Outlet } from 'react-router-dom';
import { DisclaimerBanner } from './DisclaimerBanner';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AskEdu4LoanChatbot } from '@/components/chat/AskEdu4LoanChatbot';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <DisclaimerBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <AskEdu4LoanChatbot />
      <Footer />
    </div>
  );
};
