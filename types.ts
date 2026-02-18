
export enum PaymentMethod {
  CASH = 'Cash',
  TRANSFER = 'Transfer',
  QRIS = 'QRIS'
}

export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface Transaction {
  id: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  amount: number;
  date: string; // ISO String
  paymentMethod: PaymentMethod;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string; // ISO String
}

export interface DailySummary {
  date: string;
  income: number;
  expense: number;
  profit: number;
  transactionCount: number;
}
