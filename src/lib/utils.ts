
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function abbreviateNumber(value: number): string {
  if (value >= 1e12) {
    return (value / 1e12).toFixed(1) + 'T';
  } else if (value >= 1e9) {
    return (value / 1e9).toFixed(1) + 'B';
  } else if (value >= 1e6) {
    return (value / 1e6).toFixed(1) + 'M';
  } else if (value >= 1e3) {
    return (value / 1e3).toFixed(1) + 'K';
  }
  return value.toString();
}

// Add utility function for responsive grid columns
export function getGridCols(): string {
  const width = window.innerWidth;
  if (width < 640) return "grid-cols-1"; // Mobile
  if (width < 768) return "grid-cols-2"; // Small tablet
  if (width < 1024) return "grid-cols-3"; // Tablet
  return "grid-cols-4"; // Desktop
}
