// Authentication Service

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const API_TIMEOUT = 10000;

export interface User {
  id?: number;
  email: string;
  name: string;
  password?: string;
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  success: boolean;
  data?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
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

    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json() as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    const response = await apiCall<AuthResponse>(
      '/auth/register',
      'POST',
      data
    );

    return response || {
      message: 'Cuenta registrada exitosamente.',
      success: true
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return {
      message: `Error: ${errorMessage}`,
      success: false
    };
  }
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await apiCall<AuthResponse>(
      '/auth/login',
      'POST',
      credentials
    );

    if (response.success && response.data) {
      // Guardar token en localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response || {
      message: 'Inicio de sesión exitoso.',
      success: true
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return {
      message: `Error: ${errorMessage}`,
      success: false
    };
  }
}

export function logout(): void {
  localStorage.removeItem('user');
}

export function getAuthenticatedUser(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getAuthenticatedUser() !== null;
}

// Validaciones
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8 || password.length > 10) {
    return { valid: false, error: 'La contraseña debe tener entre 8 y 10 caracteres' };
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(password);

  if (!hasUpper) {
    return { valid: false, error: 'Debe contener mayúsculas' };
  }
  if (!hasLower) {
    return { valid: false, error: 'Debe contener minúsculas' };
  }
  if (!hasDigit) {
    return { valid: false, error: 'Debe contener números' };
  }
  if (!hasSymbol) {
    return { valid: false, error: 'Debe contener símbolos' };
  }

  return { valid: true };
}

export function validateEmail(email: string): boolean {
  return /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
}
