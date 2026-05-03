import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import {
  type Expense,
  TransactionType,
  getCategoryLabel,
  getTransactionTypeLabel,
} from '../services/expenseService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: number) => void;
}

const transactionColors: Record<TransactionType, string> = {
  [TransactionType.GASTO]: 'bg-red-100 text-red-800 hover:bg-red-100',
  [TransactionType.INGRESO]: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
};

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hay transacciones registradas aún.</p>
        <p className="text-sm mt-2">Comienza registrando tu primer movimiento.</p>
      </div>
    );
  }

  // Ordenar por fecha más reciente
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedExpenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">
                {format(new Date(expense.date), 'dd MMM yyyy', { locale: es })}
              </TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>
                <Badge 
                  variant="secondary" 
                  className={transactionColors[expense.type]}
                >
                  {getTransactionTypeLabel(expense.type)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="secondary" 
                  className={expense.type === TransactionType.INGRESO ? 'bg-sky-100 text-sky-800 hover:bg-sky-100' : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100'}
                >
                  {getCategoryLabel(expense.category)}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {expense.type === TransactionType.INGRESO ? '+' : '-'}${expense.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => expense.id && onDelete(expense.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
