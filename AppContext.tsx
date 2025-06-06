import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Expense, Partner, Category } from '../types';
import { INITIAL_EXPENSES, INITIAL_PARTNERS, INITIAL_CATEGORIES, getMonthAndYearFromDate } from '../constants';
import { v4 as uuidv4 } from 'uuid';

type Theme = 'light' | 'dark';

interface AppContextType {
  expenses: Expense[];
  partners: Partner[];
  categories: Category[];
  addExpense: (expenseData: Omit<Expense, 'id' | 'month' | 'year' | 'entryTimestamp'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (expenseId: string) => void;
  addPartner: (partnerData: Omit<Partner, 'id'>) => void;
  updatePartner: (partner: Partner) => void;
  deletePartner: (partnerId: string) => void;
  addCategory: (categoryData: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  getCategoryNameById: (id: string) => string;
  getPartnerNameById: (id?: string) => string;
  theme: Theme;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PARTNERS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      return storedTheme;
    }
    // Default to system preference if available, otherwise light
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const addExpense = useCallback((expenseData: Omit<Expense, 'id' | 'month' | 'year' | 'entryTimestamp'>) => {
    const { month, year } = getMonthAndYearFromDate(expenseData.date);
    const newExpense: Expense = {
      ...expenseData,
      id: uuidv4(),
      month,
      year,
      entryTimestamp: Date.now(),
    };
    setExpenses(prev => [newExpense, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const updateExpense = useCallback((updatedExpenseData: Expense) => {
    const { month, year } = getMonthAndYearFromDate(updatedExpenseData.date);
    const fullUpdatedExpense = { ...updatedExpenseData, month, year, entryTimestamp: Date.now() };
    setExpenses(prev => prev.map(exp => exp.id === fullUpdatedExpense.id ? fullUpdatedExpense : exp).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const deleteExpense = useCallback((expenseId: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
  }, []);

  const addPartner = useCallback((partnerData: Omit<Partner, 'id'>) => {
    const newPartner: Partner = { ...partnerData, id: uuidv4() };
    setPartners(prev => [...prev, newPartner]);
  }, []);

  const updatePartner = useCallback((updatedPartner: Partner) => {
    setPartners(prev => prev.map(p => p.id === updatedPartner.id ? updatedPartner : p));
  }, []);

  const deletePartner = useCallback((partnerId: string) => {
    setPartners(prev => prev.filter(p => p.id !== partnerId));
    setExpenses(prevExpenses => prevExpenses.map(exp => 
        exp.paidByPartnerId === partnerId ? { ...exp, paidByPartnerId: INITIAL_PARTNERS.find(p => p.name === "Unassigned / Company")?.id } : exp
    ));
  }, []);

  const addCategory = useCallback((categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = { ...categoryData, id: uuidv4() };
    setCategories(prev => [...prev, newCategory]);
  }, []);

  const updateCategory = useCallback((updatedCategory: Category) => {
    setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    const miscCategory = categories.find(c => c.name.toLowerCase() === "miscellaneous");
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    setExpenses(prevExpenses => prevExpenses.map(exp =>
        exp.categoryId === categoryId ? { ...exp, categoryId: miscCategory ? miscCategory.id : '' } : exp
    ));
  }, [categories]);

  const getCategoryNameById = useCallback((id: string): string => {
    return categories.find(c => c.id === id)?.name || "N/A";
  }, [categories]);

  const getPartnerNameById = useCallback((id?: string): string => {
    if (!id) return "N/A";
    return partners.find(p => p.id === id)?.name || "Unknown Partner";
  }, [partners]);

  return (
    <AppContext.Provider value={{
      expenses, partners, categories,
      addExpense, updateExpense, deleteExpense,
      addPartner, updatePartner, deletePartner,
      addCategory, updateCategory, deleteCategory,
      getCategoryNameById, getPartnerNameById,
      theme, toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};