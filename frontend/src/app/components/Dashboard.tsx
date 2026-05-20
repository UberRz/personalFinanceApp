import { BarChart3, ChartPie, CircleDollarSign, Clock3, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { TransactionType, getCategoryLabel } from '../services/expenseService';

export interface DashboardTransaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: TransactionType;
}

export interface DashboardCategoryItem {
  name: string;
  amount: number;
}

export interface DashboardData {
  hasData: boolean;
  income: number;
  spent: number;
  available: number;
  budgetUsed: number;
  recentTransactions: DashboardTransaction[];
  categoryData: DashboardCategoryItem[];
  incomeCategoryData: DashboardCategoryItem[];
  topCategory?: DashboardCategoryItem;
  topIncomeCategory?: DashboardCategoryItem;
  transactionCount: number;
  averageTicket: number;
  periodLabel: string;
}

interface DashboardProps {
  budgetLimit: number;
  data: DashboardData;
}

const expenseChartColors = ['#2563eb', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#0f766e'];
const incomeChartColors = ['#16a34a', '#10b981', '#14b8a6', '#22c55e', '#06b6d4', '#84cc16'];

export function Dashboard({ budgetLimit, data }: DashboardProps) {
  // Debug: log category data to help diagnose missing income charts
  // (temporary - can be removed after verification)
  // eslint-disable-next-line no-console
  console.log('Dashboard data - categoryData, incomeCategoryData:', data.categoryData, data.incomeCategoryData);
  return (
    <Card className="overflow-hidden border-slate-200 bg-white/95 shadow-xl shadow-slate-200/60 backdrop-blur">
      <CardHeader className="space-y-2">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl">Dashboard</CardTitle>
            <CardDescription>
              Resumen financiero del periodo actual{data.hasData ? ` (${data.periodLabel})` : ''}
            </CardDescription>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            {data.hasData ? `${data.transactionCount} movimientos analizados` : 'Sin datos registrados'}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-6 rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-950 via-indigo-950 to-sky-900 p-6 text-white shadow-lg shadow-slate-300/40">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-200">Panel financiero</p>
              <h3 className="text-2xl font-bold md:text-3xl">Visualiza tu balance, presupuesto y categorías en un solo vistazo</h3>
              <p className="max-w-2xl text-sm text-slate-200 md:text-base">
                Este panel resalta ingresos, gastos, movimientos recientes y distribución por categoría con una lectura rápida y clara.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm md:min-w-[260px]">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-slate-200">Ingresos</p>
                <p className="mt-1 text-2xl font-bold text-emerald-300">${data.income.toFixed(2)}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-slate-200">Gastos</p>
                <p className="mt-1 text-2xl font-bold text-rose-300">${data.spent.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {!data.hasData ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-lg font-semibold text-slate-900">No existen datos suficientes para generar el panel</p>
            <p className="mt-2 text-sm text-slate-600">
              Registra ingresos, gastos y categorías para activar el dashboard financiero.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:space-x-4">
              <Card className="flex-1 bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                    <TrendingUp className="h-4 w-4" />
                    Total ingresos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-700">${data.income.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card className="flex-1 bg-gradient-to-br from-rose-50 to-white border-rose-100">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-rose-800">
                    <TrendingDown className="h-4 w-4" />
                    Total gastos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-rose-700">${data.spent.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card className="flex-1 bg-gradient-to-br from-sky-50 to-white border-sky-100">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-sky-800">
                    <CircleDollarSign className="h-4 w-4" />
                    Saldo disponible
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${data.available >= 0 ? 'text-sky-700' : 'text-rose-700'}`}>
                    ${data.available.toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle>Resumen de transacciones recientes</CardTitle>
                  <CardDescription>Últimos movimientos registrados en el periodo actual</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
                        <div>
                          <p className="font-semibold text-slate-900">{transaction.description}</p>
                          <p className="text-sm text-slate-500">
                            {getCategoryLabel(transaction.category)} · {transaction.type === TransactionType.GASTO ? 'Gasto' : 'Ingreso'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${transaction.type === TransactionType.GASTO ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {transaction.type === TransactionType.GASTO ? '-' : '+'}${transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-500">{new Date(transaction.date).toLocaleDateString('es-ES')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estado del presupuesto</CardTitle>
                  <CardDescription>Dinero usado y disponible del presupuesto mensual</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Presupuesto</span>
                      <span className="font-semibold text-slate-900">${budgetLimit.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Usado</span>
                      <span className="font-semibold text-rose-600">${data.spent.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Disponible</span>
                      <span className="font-semibold text-emerald-600">${Math.max(budgetLimit - data.spent, 0).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${data.budgetUsed > 100 ? 'bg-rose-500' : 'bg-sky-500'}`}
                      style={{ width: `${Math.min(data.budgetUsed, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    {data.budgetUsed.toFixed(1)}% del presupuesto consumido
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <Card className="border-sky-200 bg-sky-50/40">
                <CardHeader>
                  <CardTitle>Gastos por categoría</CardTitle>
                  <CardDescription>Distribución de gastos agrupados por categoría</CardDescription>
                </CardHeader>
                <CardContent className="h-[320px]">
                  {data.categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.categoryData}
                          dataKey="amount"
                          nameKey="name"
                          innerRadius={70}
                          outerRadius={110}
                          paddingAngle={4}
                        >
                          {data.categoryData.map((entry, index) => (
                            <Cell key={entry.name} fill={expenseChartColors[index % expenseChartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center">
                      <div>
                        <ChartPie className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                        <p className="font-semibold text-slate-900">No hay gastos categorizados</p>
                        <p className="text-sm text-slate-500">Agrega gastos para ver la gráfica.</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-emerald-200 bg-emerald-50/40">
                <CardHeader>
                  <CardTitle>Ingresos por categoría</CardTitle>
                  <CardDescription>Distribución de ingresos agrupados por categoría</CardDescription>
                </CardHeader>
                <CardContent className="h-[320px]">
                  {data.incomeCategoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.incomeCategoryData}
                          dataKey="amount"
                          nameKey="name"
                          innerRadius={70}
                          outerRadius={110}
                          paddingAngle={4}
                        >
                          {data.incomeCategoryData.map((entry, index) => (
                            <Cell key={entry.name} fill={incomeChartColors[index % incomeChartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center">
                      <div>
                        <ChartPie className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                        <p className="font-semibold text-slate-900">No hay ingresos categorizados</p>
                        <p className="text-sm text-slate-500">Agrega ingresos para ver la gráfica.</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <Card className="border-sky-200 bg-sky-50/30">
                <CardHeader>
                  <CardTitle>Gastos por categoría en barra</CardTitle>
                  <CardDescription>Comparativa visual de las categorías más relevantes</CardDescription>
                </CardHeader>
                <CardContent className="h-[320px]">
                  {data.categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.categoryData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                        <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                          {data.categoryData.map((entry, index) => (
                            <Cell key={entry.name} fill={expenseChartColors[index % expenseChartColors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center">
                      <div>
                        <BarChart3 className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                        <p className="font-semibold text-slate-900">No hay datos para graficar</p>
                        <p className="text-sm text-slate-500">Registra transacciones para activar esta sección.</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-emerald-200 bg-emerald-50/30">
                <CardHeader>
                  <CardTitle>Ingresos por categoría en barra</CardTitle>
                  <CardDescription>Comparativa visual de los ingresos más relevantes</CardDescription>
                </CardHeader>
                <CardContent className="h-[320px]">
                  {data.incomeCategoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.incomeCategoryData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                        <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                          {data.incomeCategoryData.map((entry, index) => (
                            <Cell key={entry.name} fill={incomeChartColors[index % incomeChartColors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center">
                      <div>
                        <BarChart3 className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                        <p className="font-semibold text-slate-900">No hay datos para graficar</p>
                        <p className="text-sm text-slate-500">Registra ingresos para activar esta sección.</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Clock3 className="h-4 w-4 text-slate-500" />
                    Última transacción
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold text-slate-900">
                    {data.recentTransactions[0]?.description ?? 'Sin movimientos'}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <ChartPie className="h-4 w-4 text-slate-500" />
                    Categoría principal gasto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold text-slate-900">
                    {data.topCategory?.name ?? 'Sin categoría'}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <BarChart3 className="h-4 w-4 text-slate-500" />
                    Categoría principal ingreso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold text-slate-900">
                    {data.topIncomeCategory?.name ?? 'Sin categoría'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
