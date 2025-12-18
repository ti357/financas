
export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'Housing' 
  | 'Food' 
  | 'Transport' 
  | 'Leisure' 
  | 'Health' 
  | 'Salary' 
  | 'Investment' 
  | 'Other';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  member: string;
  date: string;
}

export interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  partnerA_Contribution: number;
  partnerB_Contribution: number;
}
