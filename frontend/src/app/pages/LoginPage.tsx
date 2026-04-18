import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { login, validateEmail } from '@/app/services/authService';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpiar errores previos
    setEmailError('');
    setPasswordError('');

    // Validaciones
    if (!email.trim()) {
      setEmailError('El email es obligatorio');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('El email no tiene un formato válido');
      return;
    }

    if (!password.trim()) {
      setPasswordError('La contraseña es obligatoria');
      return;
    }

    try {
      setIsLoading(true);
      const result = await login({ email, password });

      if (result.success) {
        toast.success('Éxito', {
          description: result.message,
        });
        // Navegar a la página de gastos
        onNavigate('expenses');
      } else {
        toast.error('Error', {
          description: result.message,
        });
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Ocurrió un error inesperado',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-center mb-4">
              <Wallet className="w-10 h-10 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl text-center">AppFinanzas</CardTitle>
            <CardDescription className="text-center">
              Inicia sesión para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className={emailError ? 'border-red-500' : ''}
                />
                {emailError && (
                  <p className="text-sm text-red-500">{emailError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className={passwordError ? 'border-red-500' : ''}
                />
                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-center text-gray-600">
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => onNavigate('register')}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Datos de prueba:</p>
          <p className="text-xs">Email: test@test.com</p>
          <p className="text-xs">Contraseña: Test1234!</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
