import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classi CSS in modo intelligente
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatta valori monetari in Euro
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

/**
 * Formatta date in formato italiano
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("it-IT").format(new Date(date));
}
