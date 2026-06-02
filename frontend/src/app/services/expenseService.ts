import { apiCall } from './authService';

export enum TransactionType {
  GASTO = 'GASTO',
  INGRESO = 'INGRESO'
}

export type ExpenseCategory =
  | 'ALIMENTACION'
  | 'TRANSPORTE'
  | 'VIVIENDA'
  | 'ENTRETENIMIENTO'
  | 'SALUD'
  | 'EDUCACION';

export type IncomeCategory = 'INGRESO_FIJO' | 'INGRESO_EXTRA';

export type Category = ExpenseCategory | IncomeCategory;

export function getAvailableCategories(type: TransactionType): Category[] {
  if (type === TransactionType.INGRESO) {
    return ['INGRESO_FIJO', 'INGRESO_EXTRA'];
  }

  return ['ALIMENTACION', 'TRANSPORTE', 'VIVIENDA', 'ENTRETENIMIENTO', 'SALUD', 'EDUCACION'];
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: TransactionType;
  userId: number;
}

export interface ExpenseDTO {
  description: string;
  amount: number;
  category: string;
  date: string;
  type: TransactionType;
  userId: number;
}

export interface ExpenseResponse {
  message: string;
  success: boolean;
  data?: Expense;
}

export interface DashboardSummary {
  hasData: boolean;
  totalIncome: number;
  totalSpent: number;
  available: number;
  budgetUsed: number;
  budgetLimit: number;
  transactionCount: number;
  averageTicket: number;
  periodLabel: string;
  recentTransactions: any[];
  expenseCategories: any[];
  incomeCategories: any[];
  topExpenseCategory: any;
  topIncomeCategory: any;
}

// Mapeo amigable de categorías para las etiquetas visuales
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    ALIMENTACION: 'Alimentación',
    TRANSPORTE: 'Transporte',
    VIVIENDA: 'Vivienda',
    ENTRETENIMIENTO: 'Entretenimiento',
    SALUD: 'Salud',
    EDUCACION: 'Educación',
    INGRESO_FIJO: 'Ingreso fijo',
    INGRESO_EXTRA: 'Ingreso extra'
  };
  return labels[category.toUpperCase()] || category;
}

export function getTransactionTypeLabel(type: TransactionType): string {
  const labels: Record<TransactionType, string> = {
    [TransactionType.GASTO]: 'Gasto',
    [TransactionType.INGRESO]: 'Ingreso',
  };

  return labels[type] || type;
}

// --- PETICIONES HTTP USANDO APICALL (INCLUYEN TOKEN AUTOMÁTICAMENTE) ---

export async function registerExpense(dto: ExpenseDTO): Promise<ExpenseResponse> {
  try {
    return await apiCall<ExpenseResponse>('/transactions', 'POST', dto);
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'Error al registrar el movimiento',
      success: false
    };
  }
}

export async function getAllExpenses(userId: number): Promise<Expense[]> {
  try {
    // Ajusta el endpoint aquí si tu backend usa '/expenses/user/' o '/transactions/user/'
    return await apiCall<Expense[]>(`/transactions/user/${userId}`, 'GET');
  } catch (error) {
    console.error('Error en getAllExpenses:', error);
    return [];
  }
}

export async function deleteExpense(id: number): Promise<{ message: string; success: boolean }> {
  try {
    await apiCall<void>(`/transactions/${id}`, 'DELETE');
    return { message: 'Movimiento eliminado correctamente', success: true };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'No se pudo eliminar el movimiento',
      success: false
    };
  }
}

export async function getDashboardSummary(userId: number): Promise<DashboardSummary | null> {
  try {
    // El backend expone el resumen por /dashboard/{userId}
    return await apiCall<DashboardSummary>(`/dashboard/${userId}`, 'GET');
  } catch (error) {
    console.error('Error al obtener el resumen del dashboard:', error);
    return null;
  }
}

export interface BudgetStatusDTO {
  budget: number;
  totalIncome: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  year: number;
  month: number;
}

export interface BudgetDTO {
  budget: number;
  year: number;
  month: number;
}

interface BudgetResponse {
  message: string;
  success: boolean;
  data?: BudgetDTO;
}

interface BudgetRequestDTO {
  userId: number;
  limit: number;
}

export async function getBudgetStatus(userId: number): Promise<BudgetStatusDTO | null> {
  try {
    return await apiCall<BudgetStatusDTO>(`/transactions/budget-status/${userId}`, 'GET');
  } catch (error) {
    console.error('Error al obtener el estado del presupuesto:', error);
    return null;
  }
}

export async function updateBudgetLimit(userId: number, limit: number): Promise<{ success: boolean; message: string; data?: BudgetDTO }> {
  try {
    const response = await apiCall<BudgetResponse>('/transactions/budget', 'POST', {
      userId,
      limit,
    } as BudgetRequestDTO);

    return {
      success: response.success,
      message: response.message,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error al actualizar el presupuesto',
    };
  }
}
