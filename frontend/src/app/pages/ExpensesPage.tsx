import React, { useState, useEffect } from 'react';
import { LogOut, Wallet } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { BudgetSummary } from '@/app/components/BudgetSummary';
import { Dashboard, type DashboardData } from '@/app/components/Dashboard';
import { ExpenseForm } from '@/app/components/ExpenseForm';
import { ExpenseList } from '@/app/components/ExpenseList';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  registerExpense,
  getAllExpenses,
  deleteExpense,
  getDashboardSummary,
  Expense,
  ExpenseDTO,
  TransactionType,
} from '@/app/services/expenseService';
import { logout, getAuthenticatedUser } from '@/app/services/authService';

interface ExpensesPageProps {
  onNavigate: (page: string) => void;
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({ onNavigate }: ExpensesPageProps) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]); // Guardar TODOS los gastos
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<TransactionType | undefined>(undefined);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [budgetLimit, setBudgetLimit] = useState(1000);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    hasData: false,
    income: 0,
    spent: 0,
    available: 0,
    budgetUsed: 0,
    recentTransactions: [],
    categoryData: [],
    incomeCategoryData: [],
    topCategory: undefined,
    topIncomeCategory: undefined,
    transactionCount: 0,
    averageTicket: 0,
    periodLabel: 'todo el historial',
  });

  // Al montar: carga TODOS los gastos y calcula estadísticas globales
  useEffect(() => {
    loadAllExpenses();
  }, []);

  // Cuando cambian filtros: solo actualiza la vista, no las estadísticas
  useEffect(() => {
    applyFilters();
  }, [transactionTypeFilter, startDate, endDate, allExpenses]);

  const loadAllExpenses = async () => {
    try {
      setIsLoadingExpenses(true);
      setError(null);
      
      const user = getAuthenticatedUser();
      if (!user || !user.id) {
        console.error('User not authenticated or missing ID');
        setError('Usuario no autenticado');
        setIsLoadingExpenses(false);
        return;
      }
      
      console.log('Loading all expenses for userId:', user.id);
      
      const [data, summary] = await Promise.all([
        getAllExpenses(user.id),
        getDashboardSummary(user.id),
      ]);

      console.log('All expenses loaded:', data);
      setAllExpenses(data || []);

      if (summary) {
        setDashboardData({
          hasData: summary.hasData,
          income: summary.totalIncome,
          spent: summary.totalSpent,
          available: summary.available,
          budgetUsed: summary.budgetUsed,
          recentTransactions: summary.recentTransactions,
          categoryData: summary.expenseCategories,
          incomeCategoryData: summary.incomeCategories,
          topCategory: summary.topExpenseCategory ?? undefined,
          topIncomeCategory: summary.topIncomeCategory ?? undefined,
          transactionCount: summary.transactionCount,
          averageTicket: summary.averageTicket,
          periodLabel: summary.periodLabel,
        });
        setTotalSpent(summary.totalSpent);
        setTotalIncome(summary.totalIncome);
        setBudgetLimit(summary.budgetLimit);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMsg);
      toast.error('Error', {
        description: 'No se pudo cargar las transacciones.',
      });
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allExpenses];

    // Aplicar filtro de tipo
    if (transactionTypeFilter) {
      filtered = filtered.filter((t: Expense) => t.type === transactionTypeFilter);
    }

    // Aplicar filtro de fecha
    if (startDate) {
      filtered = filtered.filter((t: Expense) => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter((t: Expense) => new Date(t.date) <= new Date(endDate));
    }

    setExpenses(filtered);
  };

  const handleSubmitExpense = async (dto: ExpenseDTO) => {
    try {
      setIsLoading(true);
      const result = await registerExpense(dto);
      if (result.success) {
        toast.success('Éxito', {
          description: result.message,
        });
        // Recargar todos los gastos para actualizar estadísticas
        await loadAllExpenses();
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
        // Recargar todos los gastos para actualizar estadísticas
        await loadAllExpenses();
      } else {
        toast.error('Error', {
          description: result.message,
        });
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Error inesperado al eliminar',
      });
    }
  };;

  const isFilterActive = transactionTypeFilter !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <Toaster position="top-right" richColors />

      <div className="max-w-6xl mx-auto space-y-6">
        <nav className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-indigo-900">AppFinanzas</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => onNavigate('home')} variant="outline">
              Volver al Home
            </Button>
            <Button
              onClick={() => {
                logout();
                onNavigate('login');
              }}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </nav>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Wallet className="w-10 h-10 text-primary" />
            <h2 className="text-4xl font-bold text-slate-900">
              Gestión Financiera Personal
            </h2>
          </div>
          <p className="text-slate-600">
            Controla tus ingresos y gastos
          </p>
        </div>

        <Dashboard budgetLimit={budgetLimit} data={dashboardData} />

        {!isLoadingExpenses && (
          <BudgetSummary
            totalSpent={totalSpent}
            totalIncome={totalIncome}
            onBudgetUpdated={setBudgetLimit}
          />
        )}

        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Registrar Gasto/Ingreso</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Nuevo Gasto/Ingreso</CardTitle>
                <CardDescription>Registra un nuevo movimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseForm onSubmit={handleSubmitExpense} isLoading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Transacciones</CardTitle>
                <CardDescription>
                  {isLoadingExpenses
                    ? 'Cargando...'
                    : `${expenses.length} transacciones`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                    <p className="text-red-700 font-semibold">Error:</p>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                
                {isLoadingExpenses ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">Cargando transacciones...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* EC-01: Filtro por tipo de transacción (backend) */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h3 className="font-semibold mb-4">Filtros</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label>Tipo de Transacción</Label>
                          <Select 
                            value={transactionTypeFilter || 'ALL'} 
                            onValueChange={(val: string) => setTransactionTypeFilter(val === 'ALL' ? undefined : val as TransactionType)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ALL">Todos</SelectItem>
                              <SelectItem value="GASTO">Gastos</SelectItem>
                              <SelectItem value="INGRESO">Ingresos</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Fecha Inicio</Label>
                          <Input type="date" value={startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                          <Label>Fecha Fin</Label>
                          <Input type="date" value={endDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)} />
                        </div>
                      </div>
                      {/* EC-02: Botón para limpiar filtro */}
                      {(isFilterActive || startDate || endDate) && (
                        <Button
                          onClick={() => {
                            setTransactionTypeFilter(undefined);
                            setStartDate('');
                            setEndDate('');
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Limpiar Filtros
                        </Button>
                      )}
                    </div>

                    {expenses.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-slate-500">
                          {transactionTypeFilter 
                            ? `No hay ${transactionTypeFilter === TransactionType.GASTO ? 'gastos' : 'ingresos'} registrados`
                            : 'No hay transacciones registradas'}
                        </p>
                      </div>
                    ) : (
                      <ExpenseList
                        expenses={expenses}
                        onDelete={handleDeleteExpense}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExpensesPage;
