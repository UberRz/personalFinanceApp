import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Category,
  IncomeCategory,
  TransactionType,
  getAvailableCategories,
  getCategoryLabel,
  type ExpenseDTO,
} from '../services/expenseService';
import { Calendar } from 'lucide-react';

interface ExpenseFormProps {
  onSubmit: (expense: ExpenseDTO) => void;
  isLoading: boolean;
}

export function ExpenseForm({ onSubmit, isLoading }: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.GASTO);
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const availableCategories = getAvailableCategories(type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      description,
      amount: parseFloat(amount),
      category,
      date,
      type
    });

    // Limpiar formulario
    setDescription('');
    setAmount('');
    setType(TransactionType.GASTO);
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const isValid = description.trim() && amount && category && date;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          type="text"
          placeholder="Ej: Compra en supermercado"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo</Label>
        <Select
          value={type}
          onValueChange={(value) => {
            const nextType = value as TransactionType;
            setType(nextType);
            setCategory('');
          }}
          disabled={isLoading}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Selecciona el tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TransactionType.GASTO}>Gasto</SelectItem>
            <SelectItem value={TransactionType.INGRESO}>Ingreso</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Monto ($)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Fecha</Label>
          <div className="relative">
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isLoading}
              required
              className="pr-10"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoría</Label>
        <Select value={category} onValueChange={setCategory} disabled={isLoading}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {availableCategories.map((value) => (
              <SelectItem key={value} value={value}>
                {getCategoryLabel(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={!isValid || isLoading}>
        {isLoading ? 'Registrando...' : type === TransactionType.INGRESO ? 'Registrar Ingreso' : 'Registrar Gasto'}
      </Button>
    </form>
  );
}
