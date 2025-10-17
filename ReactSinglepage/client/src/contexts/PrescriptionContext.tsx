import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface PrescriptionData {
  id: string;
  customerName: string;
  phoneNumber: string;
  note: string;
  imageUrl: string;
  createdAt: string;
  status: 'Chờ tư vấn' | 'Đã tư vấn' | 'Đã từ chối';
  rejectionReason?: string;
}

interface PrescriptionContextType {
  prescriptions: PrescriptionData[];
  addPrescription: (prescription: Omit<PrescriptionData, 'id' | 'createdAt' | 'status'>) => string;
  getPrescriptionById: (id: string) => PrescriptionData | undefined;
  updatePrescriptionStatus: (id: string, status: PrescriptionData['status'], rejectionReason?: string) => void;
}

const PrescriptionContext = createContext<PrescriptionContextType | undefined>(undefined);

export const usePrescription = () => {
  const context = useContext(PrescriptionContext);
  if (!context) {
    throw new Error('usePrescription must be used within a PrescriptionProvider');
  }
  return context;
};

interface PrescriptionProviderProps {
  children: ReactNode;
}

export const PrescriptionProvider: React.FC<PrescriptionProviderProps> = ({ children }) => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>([]);

  const generatePrescriptionId = (): string => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `QT-${timestamp}${random}`;
  };

  const addPrescription = (prescriptionData: Omit<PrescriptionData, 'id' | 'createdAt' | 'status'>): string => {
    const id = generatePrescriptionId();
    const newPrescription: PrescriptionData = {
      ...prescriptionData,
      id,
      createdAt: new Date().toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Chờ tư vấn'
    };

    setPrescriptions(prev => [newPrescription, ...prev]);
    return id;
  };

  const getPrescriptionById = (id: string): PrescriptionData | undefined => {
    return prescriptions.find(p => p.id === id);
  };

  const updatePrescriptionStatus = (id: string, status: PrescriptionData['status'], rejectionReason?: string) => {
    setPrescriptions(prev => 
      prev.map(p => 
        p.id === id 
          ? { ...p, status, rejectionReason }
          : p
      )
    );
  };

  const value: PrescriptionContextType = {
    prescriptions,
    addPrescription,
    getPrescriptionById,
    updatePrescriptionStatus
  };

  return (
    <PrescriptionContext.Provider value={value}>
      {children}
    </PrescriptionContext.Provider>
  );
};
