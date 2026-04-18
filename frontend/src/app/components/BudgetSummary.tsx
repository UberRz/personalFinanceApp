import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { AlertCircle, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { getBudgetLimit } from '../services/expenseService';

interface BudgetSummaryProps {
  totalSpent: number;
  totalIncome: number;
}

export function BudgetSummary({ totalSpent, totalIncome }: BudgetSummaryProps) {
  const budgetLimit = getBudgetLimit();
  const percentage = (totalSpent / budgetLimit) * 100;
  const isOverBudget = totalSpent > budgetLimit;
  const disponible = totalIncome - totalSpent;
  const isOverSpent = disponible < 0;

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
