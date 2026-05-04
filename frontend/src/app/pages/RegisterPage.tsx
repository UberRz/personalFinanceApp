import React, { useState } from 'react';
import { Wallet, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { register, validateEmail, validatePassword } from '@/app/services/authService';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
  });

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    // Actualizar requisitos en tiempo real
    setPasswordRequirements({
      length: value.length >= 8 && value.length <= 10,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value),
      symbol: /[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpiar errores previos
    setErrors({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    // Validaciones locales
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!validateEmail(email)) {
      newErrors.email = 'El email no tiene un formato válido';
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.error || 'Contraseña inválida';
      }
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.values(newErrors).some(e => e)) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      const result = await register({ email, password, name });

      if (result && result.success) {
        toast.success('Éxito', {
          description: result.message || 'Cuenta registrada exitosamente.',
        });
        // Navegar al login tras un breve delay
        setTimeout(() => onNavigate('login'), 1500);
      } else {
        toast.error('Error', {
          description: result.message || 'Error al registrar la cuenta.',
        });
      }
    } catch (error: any) {
      // Extrae el mensaje de error devuelto por la API
      const errorMsg = error instanceof Error ? error.message : 'Ocurrió un error inesperado';
      toast.error('Error', {
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8">
      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-center mb-4">
              <Wallet className="w-10 h-10 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl text-center">Crear Cuenta</CardTitle>
            <CardDescription className="text-center">
              Regístrate para usar AppFinanzas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    disabled={isLoading}
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}

                {password && (
                  <div className="mt-2 p-3 bg-gray-50 rounded text-xs space-y-1">
                    <p className={`flex items-center gap-2 ${passwordRequirements.length ? 'text-green-600' : 'text-gray-500'}`}>
                      <span>{passwordRequirements.length ? '✓' : '○'}</span> 8-10 caracteres
                    </p>
                    <p className={`flex items-center gap-2 ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                      <span>{passwordRequirements.uppercase ? '✓' : '○'}</span> Mayúsculas
                    </p>
                    <p className={`flex items-center gap-2 ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                      <span>{passwordRequirements.lowercase ? '✓' : '○'}</span> Minúsculas
                    </p>
                    <p className={`flex items-center gap-2 ${passwordRequirements.number ? 'text-green-600' : 'text-gray-500'}`}>
                      <span>{passwordRequirements.number ? '✓' : '○'}</span> Números
                    </p>
                    <p className={`flex items-center gap-2 ${passwordRequirements.symbol ? 'text-green-600' : 'text-gray-500'}`}>
                      <span>{passwordRequirements.symbol ? '✓' : '○'}</span> Símbolos
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirma tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {isLoading ? 'Registrando...' : 'Crear Cuenta'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-center text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => onNavigate('login')}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;