import { apiClient } from './client';

export interface Invoice {
  id: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
}

export const paymentApi = {
  createIntent: (amount: number, currency = 'usd') => 
    apiClient.post<{ clientSecret: string; id: string }>('/payments/create-intent', { amount, currency }),
  
  createInvoice: (amount: number, description: string) => 
    apiClient.post<Invoice>('/payments/invoices', { amount, description }),
    
  getHistory: () => 
    apiClient.get<Invoice[]>('/payments/history'),
    
  confirmInvoice: (id: string, stripeId: string) => 
    apiClient.post(`/payments/invoices/${id}/confirm`, { stripeId }),
};
