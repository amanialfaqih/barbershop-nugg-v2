
import { Service, Transaction, Expense } from '../types';

const KEYS = {
  SERVICES: 'bg_services',
  TRANSACTIONS: 'bg_transactions',
  EXPENSES: 'bg_expenses',
};

export const getServices = (): Service[] => {
  const data = localStorage.getItem(KEYS.SERVICES);
  return data ? JSON.parse(data) : [];
};

export const saveService = (service: Service) => {
  const services = getServices();
  const index = services.findIndex((s) => s.id === service.id);
  if (index > -1) {
    services[index] = service;
  } else {
    services.push(service);
  }
  localStorage.setItem(KEYS.SERVICES, JSON.stringify(services));
};

export const deleteService = (id: string) => {
  const services = getServices().filter((s) => s.id !== id);
  localStorage.setItem(KEYS.SERVICES, JSON.stringify(services));
};

export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
};

export const saveTransaction = (transaction: Transaction) => {
  const transactions = getTransactions();
  transactions.push(transaction);
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const getExpenses = (): Expense[] => {
  const data = localStorage.getItem(KEYS.EXPENSES);
  return data ? JSON.parse(data) : [];
};

export const saveExpense = (expense: Expense) => {
  const expenses = getExpenses();
  expenses.push(expense);
  localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
};

export const deleteExpense = (id: string) => {
  const expenses = getExpenses().filter((e) => e.id !== id);
  localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
};

// Initial Data Seed if empty
export const seedInitialData = () => {
  if (getServices().length === 0) {
    const initialServices: Service[] = [
      { id: '1', name: 'Haircut Premium', price: 50000 },
      { id: '2', name: 'Shaving & Massage', price: 30000 },
      { id: '3', name: 'Hair Dye', price: 120000 },
      { id: '4', name: 'Wash & Style', price: 20000 },
    ];
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(initialServices));
  }
};
