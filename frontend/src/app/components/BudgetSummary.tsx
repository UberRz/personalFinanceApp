import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { AlertCircle, DollarSign, TrendingUp, Wallet } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { getBudgetLimit } from '../services/expenseService';

interface BudgetSummaryProps {
  totalSpent: number;
}

export function BudgetSummary({ totalSpent }: BudgetSummaryProps) {
  const budgetLimit = getBudgetLimit();
  const percentage = (totalSpent / budgetLimit) * 100;
  const remaining = budgetLimit - totalSpent;
  const isOverBudget = totalSpent > budgetLimit;

  return (
    <div className="space-y-4">
      {isOverBudget && (
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
            <CardTitle className="text-sm font-medium">Total Gastado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {percentage.toFixed(1)}% del presupuesto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${budgetLimit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Límite mensual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isOverBudget ? 'Excedido en' : 'Disponible'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isOverBudget ? 'text-destructive' : 'text-green-600'}`}>
              ${Math.abs(remaining).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isOverBudget ? 'Por encima del límite' : 'Restante del presupuesto'}
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
