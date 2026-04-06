package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import org.codefactory.team07.personalfinancialmanagement.domain.model.Expense;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.ExpenseRepository;

import lombok.RequiredArgsConstructor;

public class RegisterExpenseUseCase {
    private final ExpenseRepository repository;
    private final double BUDGET_LIMIT = 2000000.0; // Esto podría venir de la BD

    public RegisterExpenseUseCase(ExpenseRepository repository) {
        this.repository = repository;
    }

    public String execute(Expense expense) {
        repository.save(expense);
        
        double totalSpent = repository.getTotalSpent();
        if (totalSpent > BUDGET_LIMIT) {
            return "Gasto registrado. ¡Alerta! Has superado tu presupuesto total.";
        }
        return "Gasto registrado exitosamente.";
    }
}