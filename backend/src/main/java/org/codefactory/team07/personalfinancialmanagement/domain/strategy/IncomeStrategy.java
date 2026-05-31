package org.codefactory.team07.personalfinancialmanagement.domain.strategy;

import org.codefactory.team07.personalfinancialmanagement.domain.model.Transaction;
import org.codefactory.team07.personalfinancialmanagement.domain.model.Income;

public class IncomeStrategy implements TransactionStrategy {
    @Override
    public void process(Transaction transaction) {
        // Aquí puedes agregar lógica específica para ingresos
        if (!(transaction instanceof Income)) {
            throw new IllegalArgumentException("Transacción no es un ingreso");
        }
        // Lógica específica de ingresos (ejemplo: validaciones, logs, etc)
    }
}
