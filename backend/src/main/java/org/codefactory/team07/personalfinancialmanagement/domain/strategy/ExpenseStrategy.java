package org.codefactory.team07.personalfinancialmanagement.domain.strategy;

import org.codefactory.team07.personalfinancialmanagement.domain.model.Transaction;
import org.codefactory.team07.personalfinancialmanagement.domain.model.Expense;

public class ExpenseStrategy implements TransactionStrategy {
    @Override
    public void process(Transaction transaction) {
        // Aquí puedes agregar lógica específica para gastos
        if (!(transaction instanceof Expense)) {
            throw new IllegalArgumentException("Transacción no es un gasto");
        }
        // Lógica específica de gastos (ejemplo: validaciones, logs, etc)
    }
}
