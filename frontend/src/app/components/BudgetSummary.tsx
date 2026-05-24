import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { AlertCircle, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { getBudgetStatus, updateBudgetLimit, BudgetStatusDTO } from '../services/expenseService';
import { getAuthenticatedUser } from '../services/authService';
import { toast } from 'sonner';

interface BudgetSummaryProps {
  totalSpent: number;
  totalIncome: number;
  onBudgetUpdated: (budget: number) => void;
}

export function BudgetSummary({ totalSpent, totalIncome, onBudgetUpdated }: BudgetSummaryProps) {
  const [budgetLimit, setBudgetLimit] = useState(1000);
  const [budgetInput, setBudgetInput] = useState('1000');
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatusDTO | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const user = getAuthenticatedUser();
    if (user?.id) {
      fetchBudgetStatus(user.id);
    }
  }, []);

  const fetchBudgetStatus = async (userId: number) => {
    const status = await getBudgetStatus(userId);
    if (status) {
      setBudgetStatus(status);
      setBudgetLimit(status.budget);
      setBudgetInput(String(status.budget));
      onBudgetUpdated(status.budget);
    }
  };

  const displayedSpent = budgetStatus?.spent ?? totalSpent;
  const displayedIncome = budgetStatus?.totalIncome ?? totalIncome;
  const disponible = budgetStatus?.remaining ?? (budgetLimit - displayedSpent);
  const percentage = budgetStatus?.percentageUsed ?? (budgetLimit > 0 ? (displayedSpent / budgetLimit) * 100 : 0);
  const isOverBudget = displayedSpent > budgetLimit;
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

      await fetchBudgetStatus(user.id);
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
              Presupuesto restante
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
              {isSaving ? 'Guardando...' : 'Editar Presupuesto'}
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
