// Backend API Service - Personal Financial Management

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
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
}

export interface ApiResponse {
  message: string;
  success: boolean;
}

const BUDGET_LIMIT = 1000.0;

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

// Validaciones del dominio (igual que en el backend)
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

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: unknown
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
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

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json() as T;
  } finally {
    clearTimeout(timeout);
  }
}

// API Service Functions
export async function registerExpense(dto: ExpenseDTO): Promise<ApiResponse> {
  try {
    validateExpense(dto);
    const type = dto.type ?? TransactionType.GASTO;

    const response = await apiCall<ApiResponse>(
      '/expenses',
      'POST',
      {
        description: dto.description,
        amount: dto.amount,
        category: dto.category.toUpperCase(),
        date: dto.date,
        type
      }
    );

    return response || {
      message: type === TransactionType.INGRESO
        ? 'Ingreso registrado exitosamente.'
        : 'Gasto registrado exitosamente.',
      success: true
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return {
      message: `Error en los datos: ${errorMessage}`,
      success: false
    };
  }
}

export async function getAllExpenses(transactionType?: TransactionType, startDate?: string, endDate?: string): Promise<Expense[]> {
  try {
    let endpoint = '/expenses';
    // Construye URL con query string si se proporciona filtro
    const params: string[] = [];
    if (transactionType) params.push(`type=${encodeURIComponent(transactionType)}`);
    if (startDate) params.push(`startDate=${encodeURIComponent(startDate)}`);
    if (endDate) params.push(`endDate=${encodeURIComponent(endDate)}`);
    if (params.length) endpoint += `?${params.join('&')}`;
    const expenses = await apiCall<Expense[]>(endpoint, 'GET');
    return expenses || [];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
}

export async function getTotalSpent(): Promise<number> {
  try {
    // Obtiene solo los gastos del backend
    const expenses = await getAllExpenses(TransactionType.GASTO);
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  } catch (error) {
    console.error('Error calculating total spent:', error);
    throw error;
  }
}

export async function getTotalIncome(): Promise<number> {
  try {
    // Obtiene solo los ingresos del backend
    const expenses = await getAllExpenses(TransactionType.INGRESO);
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  } catch (error) {
    console.error('Error calculating total income:', error);
    throw error;
  }
}

export async function deleteExpense(id: number): Promise<ApiResponse> {
  try {
    const response = await apiCall<ApiResponse>(`/expenses/${id}`, 'DELETE');
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

export function getBudgetLimit(): number {
  return BUDGET_LIMIT;
}
