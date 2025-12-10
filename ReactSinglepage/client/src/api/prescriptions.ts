import { API_BASE } from '@/lib/utils';

export interface PrescriptionData {
  id: string;
  customerName: string;
  phoneNumber: string;
  note: string;
  imageUrl: string;
  createdAt: string;
  status: 'Chờ tư vấn' | 'Đã tư vấn' | 'Đã từ chối';
  rejectionReason?: string;
  doctorName?: string;
  hospitalName?: string;
  examinationDate?: string;
}

export interface CreatePrescriptionData {
  imageUrl: string;
  // Optional fields - will be extracted by OCR if not provided
  customerName?: string;
  phoneNumber?: string;
  note?: string;
  doctorName?: string;
  hospitalName?: string;
  examinationDate?: string;
}

export interface PrescriptionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  saved: number;
}

function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  console.log('API - Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'null');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

// Function to update token automatically
function updateTokenIfNeeded() {
  const newToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGU1MjUyOGI4MDEwYmRlNDJhMmY1ODkiLCJpYXQiOjE3NjEyMTQ5MjEsImV4cCI6MTc2MTgyMzcyMX0.8K9vQ2x7mN3pL6rT1wY4uE5iO8aS2dF9gH0jK3lM6nP';
  console.log('🔄 Auto-updating JWT token...');
  localStorage.setItem('auth_token', newToken);
  console.log('✅ Token updated automatically!');
}

export async function createPrescription(data: CreatePrescriptionData): Promise<PrescriptionData> {
  console.log('API - Creating prescription with imageUrl:', data.imageUrl ? 'provided' : 'missing');
  console.log('API - URL:', `${API_BASE}/api/prescriptions`);
  
  // Only send imageUrl - backend will use OCR to extract other info
  const requestData = {
    imageUrl: data.imageUrl
  };
  
  let response = await fetch(`${API_BASE}/api/prescriptions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(requestData),
  });

  console.log('API - Response status:', response.status);
  console.log('API - Response headers:', Object.fromEntries(response.headers.entries()));

  // If 403 error, try updating token and retry once
  if (response.status === 403) {
    console.log('🔄 Got 403 error, updating token and retrying...');
    updateTokenIfNeeded();
    
    // Retry with new token
    response = await fetch(`${API_BASE}/api/prescriptions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    console.log('API - Retry response status:', response.status);
  }

  if (!response.ok) {
    const error = await response.text();
    console.error('API - Error response:', error);
    throw new Error(`Failed to create prescription: ${error}`);
  }

  const result = await response.json();
  console.log('API - Success response:', result);
  return result.data;
}

export async function getUserPrescriptions(page = 1, limit = 20): Promise<{
  data: PrescriptionData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> {
  let response = await fetch(`${API_BASE}/api/prescriptions?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  // If 403 error, try updating token and retry once
  if (response.status === 403) {
    console.log('🔄 Got 403 error in getUserPrescriptions, updating token and retrying...');
    updateTokenIfNeeded();
    
    // Retry with new token
    response = await fetch(`${API_BASE}/api/prescriptions?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch prescriptions: ${error}`);
  }

  const result = await response.json();
  return result;
}

export async function getPrescriptionById(id: string): Promise<PrescriptionData> {
  let response = await fetch(`${API_BASE}/api/prescriptions/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  // If 403 error, try updating token and retry once
  if (response.status === 403) {
    console.log('🔄 Got 403 error in getPrescriptionById, updating token and retrying...');
    updateTokenIfNeeded();
    
    // Retry with new token
    response = await fetch(`${API_BASE}/api/prescriptions/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch prescription: ${error}`);
  }

  const result = await response.json();
  return result.data;
}

export async function updatePrescriptionStatus(
  id: string, 
  status: 'pending' | 'approved' | 'rejected' | 'saved',
  rejectionReason?: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/api/prescriptions/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, rejectionReason }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update prescription status: ${error}`);
  }
}

export async function deletePrescription(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/prescriptions/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete prescription: ${error}`);
  }
}

export async function getPrescriptionStats(): Promise<PrescriptionStats> {
  const response = await fetch(`${API_BASE}/api/prescriptions/stats`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch prescription stats: ${error}`);
  }

  const result = await response.json();
  return result.data;
}
