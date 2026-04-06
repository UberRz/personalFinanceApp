import React, { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { BudgetSummary } from '@/app/components/BudgetSummary';
import { ExpenseForm } from '@/app/components/ExpenseForm';
import { ExpenseList } from '@/app/components/ExpenseList';
import {
  registerExpense,
  getAllExpenses,
  deleteExpense,
  getBudgetLimit,
  Expense,
  ExpenseDTO,
} from '@/app/services/expenseService';

interface ExpensesPageProps {
  onNavigate: (page: string) => void;
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({ onNavigate }: ExpensesPageProps) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);
  const budgetLimit = getBudgetLimit();

  // Load expenses on mount
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setIsLoadingExpenses(true);
      const data = await getAllExpenses();
      setExpenses(data);
      const total = data.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
      setTotalSpent(total);
    } catch (error) {
      console.error('Error loading expenses:', error);
      toast.error('Error', {
        description: 'No se pudo cargar los gastos. Verifica la conexión con el backend.',
      });
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  const handleSubmitExpense = async (dto: ExpenseDTO) => {
    try {
      setIsLoading(true);
      const result = await registerExpense(dto);

      if (result.success) {
        toast.success('Éxito', {
          description: result.message,
        });
        // Reload expenses
        await loadExpenses();
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

  const handleDeleteExpense = async (id: number) => {
    try {
      const result = await deleteExpense(id);
      if (result.success) {
        toast.success('Éxito', {
          description: result.message,
        });
        await loadExpenses();
      } else {
        toast.error('Error', {
          description: result.message,
        });
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Error inesperado al eliminar el gasto',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <Toaster position="top-right" richColors />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <nav className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-indigo-900">AppFinanzas</h1>
          </div>
          <Button 
            onClick={() => onNavigate('home')}
            variant="outline"
          >
            Volver al Home
          </Button>
        </nav>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Wallet className="w-10 h-10 text-primary" />
            <h2 className="text-4xl font-bold text-slate-900">
              Gestión Financiera Personal
            </h2>
          </div>
          <p className="text-slate-600">
            Controla tus gastos y mantén tu presupuesto bajo control
          </p>
        </div>

        {/* Budget Summary */}
        {!isLoadingExpenses && <BudgetSummary totalSpent={totalSpent} />}

        {/* Main Content */}
        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Registrar Gasto</TabsTrigger>
            <TabsTrigger value="history">Historial de Gastos</TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Nuevo Gasto</CardTitle>
                <CardDescription>
                  Registra un nuevo gasto en tu presupuesto mensual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseForm onSubmit={handleSubmitExpense} isLoading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Gastos</CardTitle>
                <CardDescription>
                  {isLoadingExpenses
                    ? 'Cargando...'
                    : expenses.length === 0
                    ? 'No hay gastos registrados'
                    : `${expenses.length} gasto${expenses.length !== 1 ? 's' : ''} registrado${
                        expenses.length !== 1 ? 's' : ''
                      }`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingExpenses ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">Cargando gastos...</p>
                  </div>
                ) : (
                  <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Footer */}
        <Card className="bg-slate-900 text-white border-slate-800">
          <CardContent className="pt-6">
            <div className="text-sm space-y-2">
              <p className="font-medium">💡 Integración con Backend</p>
              <p className="text-slate-300">
                Esta aplicación está integrada con el backend de Spring Boot. Los datos se almacenan en PostgreSQL
                y todas las operaciones se replican en la base de datos del servidor.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 text-xs text-slate-400">
                <div>
                  <span className="font-medium text-slate-200">API Endpoints:</span>
                  <p>POST /expenses, GET /expenses, DELETE /expenses/:id</p>
                </div>
                <div>
                  <span className="font-medium text-slate-200">Presupuesto límite:</span>
                  <p>${budgetLimit.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpensesPage;
