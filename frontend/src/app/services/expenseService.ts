import { apiCall } from './authService';

export enum TransactionType {
  GASTO = 'GASTO',
  INGRESO = 'INGRESO'
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
    SALARIO: 'Salario',
    INVERSION: 'Inversión',
    OTROS: 'Otros'
  };
  return labels[category.toUpperCase()] || category;
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
    // Ajusta el endpoint según cómo lo tengas mapeado en tu controlador de Spring Boot
    return await apiCall<DashboardSummary>(`/transactions/user/${userId}/summary`, 'GET');
  } catch (error) {
    console.error('Error al obtener el resumen del dashboard:', error);
    return null;
  }
}