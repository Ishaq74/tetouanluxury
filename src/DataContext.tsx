import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DataContextType {
  bookings: any[];
  serviceRequests: any[];
  addServiceRequest: (request: any) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);

  const addServiceRequest = (request: any) => {
    setServiceRequests((prev) => [...prev, request]);
  };

  return (
    <DataContext.Provider value={{ bookings, serviceRequests, addServiceRequest }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
