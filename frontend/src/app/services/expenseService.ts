export interface BudgetStatusDTO {
  budget: number;
  totalIncome: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  year: number;
  month: number;
}

export interface DashboardCategoryDTO {
  name: string;
  amount: number;
}

export interface DashboardTransactionDTO {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: TransactionType;
}

export interface DashboardSummaryDTO {
  hasData: boolean;
  periodLabel: string;
  totalIncome: number;
  totalSpent: number;
  available: number;
  budgetLimit: number;
  budgetUsed: number;
  remainingBudget: number;
  transactionCount: number;
  averageTicket: number;
  recentTransactions: DashboardTransactionDTO[];
  expenseCategories: DashboardCategoryDTO[];
  incomeCategories: DashboardCategoryDTO[];
  topExpenseCategory?: DashboardCategoryDTO | null;
  topIncomeCategory?: DashboardCategoryDTO | null;
  lastTransaction?: DashboardTransactionDTO | null;
}

export async function getBudgetStatus(userId: number): Promise<BudgetStatusDTO | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/budget-status/${userId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching budget status:', error);
    return null;
  }
}

export async function getDashboardSummary(userId: number): Promise<DashboardSummaryDTO | null> {
  try {
    const response = await apiCall<DashboardSummaryDTO>(`/dashboard/${userId}`);
    return response || null;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return null;
  }
}

interface BudgetCurrentResponse {
  limit: number;
  year: number;
  month: number;
}

export async function getCurrentBudget(userId: number): Promise<number | null> {
  try {
    const response = await apiCall<BudgetCurrentResponse>(`/transactions/budget/${userId}`);
    return response.limit;
  } catch (error) {
    console.error('Error fetching current budget:', error);
    return null;
  }
}
import { getAuthenticatedUser } from './authService';

// Backend API Service - Personal Financial Management

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';
const API_TIMEOUT = 10000;

export enum TransactionType {
  GASTO = 'GASTO',
  INGRESO = 'INGRESO'
}

export enum Category {
  ALIMENTACION = 'ALIMENTACION',
  TRANSPORTE = 'TRANSPORTE',
  VIVIENDA = 'VIVIENDA',
  ENTRETENIMIENTO = 'ENTRETENIMIENTO',
  SALUD = 'SALUD',
  EDUCACION = 'EDUCACION'
}

export enum IncomeCategory {
  INGRESO_FIJO = 'INGRESO_FIJO',
  INGRESO_EXTRA = 'INGRESO_EXTRA'
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string; // ISO date string
  type: TransactionType;
}

export interface ExpenseDTO {
  description: string;
  amount: number;
  category: string;
  date: string;
  type?: TransactionType;
  userId: number;
}

export interface ApiResponse {
  message: string;
  success: boolean;
}

interface BudgetUpdateResponse extends ApiResponse {
  data?: {
    budgetLimit?: number;
  };
}

const transactionTypeLabels: Record<TransactionType, string> = {
  [TransactionType.GASTO]: 'Gasto',
  [TransactionType.INGRESO]: 'Ingreso'
};

export const categoryLabels: Record<string, string> = {
  [Category.ALIMENTACION]: 'Alimentación',
  [Category.TRANSPORTE]: 'Transporte',
  [Category.VIVIENDA]: 'Vivienda',
  [Category.ENTRETENIMIENTO]: 'Entretenimiento',
  [Category.SALUD]: 'Salud',
  [Category.EDUCACION]: 'Educación',
  [IncomeCategory.INGRESO_FIJO]: 'Ingreso fijo',
  [IncomeCategory.INGRESO_EXTRA]: 'Ingreso extra'
};

export function getCategoryLabel(category: string): string {
  return categoryLabels[category] ?? category;
}

export function getAvailableCategories(type: TransactionType): string[] {
  return type === TransactionType.INGRESO
    ? Object.values(IncomeCategory)
    : Object.values(Category);
}

export function getTransactionTypeLabel(type: TransactionType): string {
  return transactionTypeLabels[type];
}

function validateExpense(dto: ExpenseDTO): void {
  if (dto.amount <= 0) {
    throw new Error("El monto debe ser mayor a 0");
  }

  const type = dto.type ?? TransactionType.GASTO;

  if (!dto.category) {
    throw new Error("La categoría no es válida");
  }

  if (type === TransactionType.INGRESO) {
    if (!Object.values(IncomeCategory).includes(dto.category as IncomeCategory)) {
      throw new Error("La categoría no es válida para un ingreso");
    }
  } else if (!Object.values(Category).includes(dto.category as Category)) {
    throw new Error("La categoría no es válida para un gasto");
  }
  
  if (!dto.date) {
    throw new Error("La fecha es obligatoria");
  }
}

async function apiCall<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: unknown,
  extraHeaders?: Record<string, string>
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const currentUser = getAuthenticatedUser();
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(currentUser?.id ? { 'X-User-Id': String(currentUser.id) } : {}),
        ...extraHeaders,
      },
      signal: controller.signal,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json() as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function registerExpense(dto: ExpenseDTO): Promise<ApiResponse> {
  try {
    validateExpense(dto);
    const type = dto.type ?? TransactionType.GASTO;

    return await apiCall<ApiResponse>(
      '/transactions',
      'POST',
      {
        description: dto.description,
        amount: dto.amount,
        category: dto.category.toUpperCase(),
        date: dto.date,
        type,
        userId: dto.userId
      }
    );
  } catch (error) {
    return {
      message: `Error: ${error instanceof Error ? error.message : 'Desconocido'}`,
      success: false
    };
  }
}
export async function getAllExpenses(
  userId: number,
  transactionType?: TransactionType,
  startDate?: string,
  endDate?: string
): Promise<Expense[]> {
  try {
    let endpoint = `/transactions/history/${userId}`;
    const params: string[] = [];

    // Solo agregar el tipo si es válido
    if (transactionType) {
      params.push(`type=${transactionType}`);
    }

    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);

    if (params.length) endpoint += `?${params.join('&')}`;

    const expenses = await apiCall<Expense[]>(endpoint, 'GET');
    return expenses || [];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
}

export async function getTotalSpent(userId: number): Promise<number> {
  const expenses = await getAllExpenses(userId, TransactionType.GASTO);
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

export async function getTotalIncome(userId: number): Promise<number> {
  const expenses = await getAllExpenses(userId, TransactionType.INGRESO);
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}
export async function deleteExpense(id: number): Promise<ApiResponse> {
  try {
    const user = getAuthenticatedUser();
    const response = await apiCall<ApiResponse>(
      `/transactions/${id}`,
      'DELETE',
      undefined,
      user?.id ? { 'X-User-Id': String(user.id) } : undefined,
    );
    return response || {
      message: 'Gasto eliminado correctamente.',
      success: true
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return {
      message: `Error al eliminar el gasto: ${errorMessage}`,
      success: false
    };
  }
}

export async function updateBudgetLimit(userId: number, budgetLimit: number): Promise<ApiResponse> {
  try {
    const response = await apiCall<ApiResponse>('/transactions/budget', 'POST', {
      userId,
      limit: budgetLimit,
    });

    return response;
  } catch (error) {
    return {
      message: `Error: ${error instanceof Error ? error.message : 'Desconocido'}`,
      success: false,
    };
  }
}