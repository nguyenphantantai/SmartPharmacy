const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || 'http://localhost:5000';

function authHeaders() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getLoyaltyAccount() {
  const res = await fetch(`${API_BASE}/api/loyalty/account`, { headers: { ...authHeaders() } });
  const data = await res.json();
  if (!data?.success) throw new Error(data?.message || 'Failed to load loyalty');
  return data.data as { pointsBalance: number; lifetimePoints: number };
}

export async function getLoyaltyTransactions() {
  const res = await fetch(`${API_BASE}/api/loyalty/transactions`, { headers: { ...authHeaders() } });
  const data = await res.json();
  if (!data?.success) throw new Error(data?.message || 'Failed to load transactions');
  return data.data as any[];
}


