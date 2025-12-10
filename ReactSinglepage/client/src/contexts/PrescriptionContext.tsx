import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createPrescription, 
  getUserPrescriptions, 
  getPrescriptionById as fetchPrescriptionByIdFromAPI,
  updatePrescriptionStatus,
  deletePrescription,
  PrescriptionData,
  CreatePrescriptionData
} from '@/api/prescriptions';

interface PrescriptionContextType {
  prescriptions: PrescriptionData[];
  isLoading: boolean;
  error: Error | null;
  addPrescription: (prescription: CreatePrescriptionData) => Promise<string>;
  getPrescriptionById: (id: string) => PrescriptionData | undefined;
  fetchPrescriptionById: (id: string) => Promise<PrescriptionData>;
  updatePrescriptionStatus: (id: string, status: PrescriptionData['status'], rejectionReason?: string) => Promise<void>;
  deletePrescription: (id: string) => Promise<void>;
  refetchPrescriptions: () => void;
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
  const queryClient = useQueryClient();

  // Fetch prescriptions from API
  const { 
    data: prescriptionsData, 
    isLoading, 
    error, 
    refetch: refetchPrescriptions 
  } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: () => getUserPrescriptions(1, 100), // Get first 100 prescriptions
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const prescriptions = prescriptionsData?.data || [];

  // Create prescription mutation
  const createPrescriptionMutation = useMutation({
    mutationFn: createPrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });

  // Update prescription status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, rejectionReason }: { 
      id: string; 
      status: 'pending' | 'approved' | 'rejected' | 'saved'; 
      rejectionReason?: string; 
    }) => updatePrescriptionStatus(id, status, rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });

  // Delete prescription mutation
  const deletePrescriptionMutation = useMutation({
    mutationFn: deletePrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });

  const addPrescription = async (prescriptionData: CreatePrescriptionData): Promise<string> => {
    try {
      const newPrescription = await createPrescriptionMutation.mutateAsync(prescriptionData);
      return newPrescription.id;
    } catch (error) {
      console.error('Error creating prescription:', error);
      throw error;
    }
  };

  // Get prescription by ID - tries local cache first
  const getPrescriptionById = (id: string): PrescriptionData | undefined => {
    return prescriptions.find(p => p.id === id);
  };

  // Fetch prescription by ID from API
  const fetchPrescriptionById = async (id: string): Promise<PrescriptionData> => {
    const prescription = await fetchPrescriptionByIdFromAPI(id);
    // Update cache
    queryClient.setQueryData(['prescriptions'], (oldData: any) => {
      if (!oldData) return oldData;
      const existing = oldData.data.find((p: PrescriptionData) => p.id === id);
      if (existing) {
        // Update existing
        return {
          ...oldData,
          data: oldData.data.map((p: PrescriptionData) => p.id === id ? prescription : p)
        };
      } else {
        // Add new
        return {
          ...oldData,
          data: [prescription, ...oldData.data]
        };
      }
    });
    return prescription;
  };

  const updatePrescriptionStatusHandler = async (
    id: string, 
    status: PrescriptionData['status'], 
    rejectionReason?: string
  ): Promise<void> => {
    try {
      const backendStatus = status === 'Chờ tư vấn' ? 'pending' :
                           status === 'Đã tư vấn' ? 'approved' :
                           status === 'Đã từ chối' ? 'rejected' : 'saved';
      
      await updateStatusMutation.mutateAsync({ id, status: backendStatus, rejectionReason });
    } catch (error) {
      console.error('Error updating prescription status:', error);
      throw error;
    }
  };

  const deletePrescriptionHandler = async (id: string): Promise<void> => {
    try {
      await deletePrescriptionMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting prescription:', error);
      throw error;
    }
  };

  const value: PrescriptionContextType = {
    prescriptions,
    isLoading,
    error: error as Error | null,
    addPrescription,
    getPrescriptionById,
    updatePrescriptionStatus: updatePrescriptionStatusHandler,
    deletePrescription: deletePrescriptionHandler,
    refetchPrescriptions,
  };

  return (
    <PrescriptionContext.Provider value={value}>
      {children}
    </PrescriptionContext.Provider>
  );
};
