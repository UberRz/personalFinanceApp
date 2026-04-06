// Backend API Service - Personal Financial Management

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const API_TIMEOUT = 10000;

export enum Category {
  ALIMENTACION = 'ALIMENTACION',
  TRANSPORTE = 'TRANSPORTE',
  VIVIENDA = 'VIVIENDA',
  ENTRETENIMIENTO = 'ENTRETENIMIENTO',
  SALUD = 'SALUD',
  EDUCACION = 'EDUCACION'
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: Category;
  date: string; // ISO date string
}

export interface ExpenseDTO {
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface ApiResponse {
  message: string;
  success: boolean;
}

const BUDGET_LIMIT = 1000.0;

// Validaciones del dominio (igual que en el backend)
function validateExpense(dto: ExpenseDTO): void {
  if (dto.amount <= 0) {
    throw new Error("El monto debe ser mayor a 0");
  }
  
  if (!dto.category || !Object.values(Category).includes(dto.category as Category)) {
    throw new Error("La categoría no es válida");
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

    const response = await apiCall<ApiResponse>(
      '/expenses',
      'POST',
      {
        description: dto.description,
        amount: dto.amount,
        category: dto.category.toUpperCase(),
        date: dto.date
      }
    );

    return response || {
      message: 'Gasto registrado exitosamente.',
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

export async function getAllExpenses(): Promise<Expense[]> {
  try {
    const expenses = await apiCall<Expense[]>('/expenses', 'GET');
    return expenses || [];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
}

export async function getTotalSpent(): Promise<number> {
  try {
    const expenses = await getAllExpenses();
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  } catch (error) {
    console.error('Error calculating total spent:', error);
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

export const categoryLabels: Record<Category, string> = {
  [Category.ALIMENTACION]: 'Alimentación',
  [Category.TRANSPORTE]: 'Transporte',
  [Category.VIVIENDA]: 'Vivienda',
  [Category.ENTRETENIMIENTO]: 'Entretenimiento',
  [Category.SALUD]: 'Salud',
  [Category.EDUCACION]: 'Educación'
};
