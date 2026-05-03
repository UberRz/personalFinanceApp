package org.codefactory.team07.personalfinancialmanagement.domain.model;

import java.time.LocalDate;

public class Income extends Expense {
    public Income(String description, double amount, IncomeCategory category, LocalDate date) {
        this(null, description, amount, category, date);
    }

    public Income(Long id, String description, double amount, IncomeCategory category, LocalDate date) {
        super(id, description, amount, category.name(), date, TransactionType.INGRESO);
    }
}
