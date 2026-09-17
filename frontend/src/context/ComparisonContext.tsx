import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SelectedSchemeSummary {
  id: string;
  schemeName: string;
  bankName: string;
  code?: string;
}

interface ComparisonContextType {
  selectedSchemes: SelectedSchemeSummary[];
  addScheme: (scheme: SelectedSchemeSummary) => boolean;
  removeScheme: (id: string) => void;
  clearComparison: () => void;
  isComparing: (id: string) => boolean;
  warningMessage: string | null;
  dismissWarning: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const STORAGE_KEY = 'edu4loan_comparison_schemes';

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSchemes, setSelectedSchemes] = useState<SelectedSchemeSummary[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedSchemes));
    } catch (err) {
      console.error('Failed to persist comparison selection:', err);
    }
  }, [selectedSchemes]);

  // Clear warning after 4 seconds
  useEffect(() => {
    if (warningMessage) {
      const timer = setTimeout(() => setWarningMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [warningMessage]);

  const addScheme = (scheme: SelectedSchemeSummary): boolean => {
    if (selectedSchemes.some((s) => s.id === scheme.id)) {
      return true;
    }

    if (selectedSchemes.length >= 4) {
      setWarningMessage('You can compare up to 4 schemes at a time.');
      return false;
    }

    setSelectedSchemes((prev) => [...prev, scheme]);
    return true;
  };

  const removeScheme = (id: string) => {
    setSelectedSchemes((prev) => prev.filter((s) => s.id !== id));
  };

  const clearComparison = () => {
    setSelectedSchemes([]);
    setWarningMessage(null);
  };

  const isComparing = (id: string): boolean => {
    return selectedSchemes.some((s) => s.id === id);
  };

  const dismissWarning = () => {
    setWarningMessage(null);
  };

  return (
    <ComparisonContext.Provider
      value={{
        selectedSchemes,
        addScheme,
        removeScheme,
        clearComparison,
        isComparing,
        warningMessage,
        dismissWarning,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = (): ComparisonContextType => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
