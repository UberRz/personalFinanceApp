// Authentication Service

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';
const API_TIMEOUT = 10000;

export interface User {
  id?: number;
  email: string;
  name: string;
  password?: string;
  createdAt?: string;
  budgetLimit?: number;
}

export interface AuthResponse {
  message: string;
  success: boolean;
  data?: {
    token: string;
    id: number;
    email: string;
    name: string;
  };
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
export async function apiCall<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: unknown
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Inyecta automáticamente el token JWT en cada petición HTTP
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options: RequestInit = {
      method,
      headers,
      signal: controller.signal,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, options);

    let responseData: any;
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }

    if (!response.ok) {
      const errorMsg = responseData?.message || responseData?.error || `Error ${response.status}`;
      throw new Error(errorMsg);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return responseData as T;
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
    return {
      message: error instanceof Error ? error.message : 'Error de conexión con el servidor',
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

    if (response && response.success && response.data) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        email: response.data.email,
        name: response.data.name
      }));
    }

    return response || {
      message: 'Inicio de sesión exitoso.',
      success: true
    };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'Error de conexión con el servidor',
      success: false
    };
  }
}

export async function logout(): Promise<void> {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      // Avisa al backend para que destruya/invalide el token JWT
      await apiCall<AuthResponse>('/auth/logout', 'POST');
    } catch (error) {
      console.error('Error al invalidar el token en el servidor:', error);
    }
  }
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getAuthToken(): string | null {
  return localStorage.getItem('token');
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

export function updateAuthenticatedUser(partialUser: Partial<User>): User | null {
  const currentUser = getAuthenticatedUser();
  if (!currentUser) return null;

  const updatedUser = {
    ...currentUser,
    ...partialUser,
  };

  localStorage.setItem('user', JSON.stringify(updatedUser));
  return updatedUser;
}

export function isAuthenticated(): boolean {
  return localStorage.getItem('token') !== null;
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

  if (!hasUpper) return { valid: false, error: 'Debe contener mayúsculas' };
  if (!hasLower) return { valid: false, error: 'Debe contener minúsculas' };
  if (!hasDigit) return { valid: false, error: 'Debe contener números' };
  if (!hasSymbol) return { valid: false, error: 'Debe contener símbolos' };

  return { valid: true };
}

export function validateEmail(email: string): boolean {
  return /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
}