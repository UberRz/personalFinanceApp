import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { AlertCircle, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { getBudgetLimit, updateBudgetLimit } from '../services/expenseService';
import { getAuthenticatedUser } from '../services/authService';
import { toast } from 'sonner';

interface BudgetSummaryProps {
  totalSpent: number;
  totalIncome: number;
}

export function BudgetSummary({ totalSpent, totalIncome }: BudgetSummaryProps) {
  const [budgetLimit, setBudgetLimit] = useState(() => getBudgetLimit());
  const [budgetInput, setBudgetInput] = useState(String(getBudgetLimit()));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const currentBudget = getBudgetLimit();
    setBudgetLimit(currentBudget);
    setBudgetInput(String(currentBudget));
  }, []);

  const percentage = (totalSpent / budgetLimit) * 100;
  const isOverBudget = totalSpent > budgetLimit;
  const disponible = totalIncome - totalSpent;
  const isOverSpent = disponible < 0;

  const handleDefineBudget = async () => {
    const user = getAuthenticatedUser();

    if (!user?.id) {
      toast.error('Debes iniciar sesión para definir el presupuesto.');
      return;
    }

    const parsedBudget = Number.parseFloat(budgetInput);

    if (!Number.isFinite(parsedBudget) || parsedBudget <= 0) {
      toast.error('Ingresa un presupuesto válido mayor a 0.');
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateBudgetLimit(user.id, parsedBudget);

      if (!result.success) {
        toast.error('No se pudo definir el presupuesto.', {
          description: result.message,
        });
        return;
      }

      setBudgetLimit(parsedBudget);
      setBudgetInput(String(parsedBudget));
      toast.success('Presupuesto actualizado correctamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {isOverSpent && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>⚠️ ¡ALERTA: Sobregasto Detectado!</AlertTitle>
          <AlertDescription>
            Has gastado <strong>${Math.abs(disponible).toFixed(2)}</strong> más de lo que tienes disponible. 
            Necesitas recuperar dinero o dejar de gastar inmediatamente.
          </AlertDescription>
        </Alert>
      )}

      {isOverBudget && !isOverSpent && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>¡Presupuesto Superado!</AlertTitle>
          <AlertDescription>
            Has excedido tu presupuesto mensual en ${(totalSpent - budgetLimit).toFixed(2)}.
            Considera reducir tus gastos.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">${totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Dinero ingresado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gastado</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {percentage.toFixed(1)}% del presupuesto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Disponible
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${disponible >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${disponible.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ingresos - Gastado
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Progreso del Presupuesto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <Input
              type="number"
              min="1"
              step="0.01"
              value={budgetInput}
              onChange={(event) => setBudgetInput(event.target.value)}
              placeholder="Ingresa tu presupuesto"
            />
            <Button onClick={handleDefineBudget} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Definir Presupuesto'}
            </Button>
          </div>
          <Progress 
            value={Math.min(percentage, 100)} 
            className={`h-2 ${isOverBudget ? '[&>div]:bg-destructive' : ''}`}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span className={isOverBudget ? 'text-destructive font-medium' : ''}>
              ${totalSpent.toFixed(2)} / ${budgetLimit.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
