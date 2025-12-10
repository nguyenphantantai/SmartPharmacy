import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// API base URL for backend server
export const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || "http://localhost:5000";
