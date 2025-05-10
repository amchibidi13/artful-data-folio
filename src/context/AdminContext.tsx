
import React, { createContext, useContext, useState } from 'react';

type AdminContextType = {
  selectedPage: string;
  setSelectedPage: (page: string) => void;
  selectedSection: string;
  setSelectedSection: (section: string) => void;
  pageLinks: Record<string, string>;
  setPageLinks: (links: Record<string, string>) => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [pageLinks, setPageLinks] = useState<Record<string, string>>({});

  return (
    <AdminContext.Provider
      value={{
        selectedPage,
        setSelectedPage,
        selectedSection,
        setSelectedSection,
        pageLinks,
        setPageLinks
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
