package org.codefactory.team07.personalfinancialmanagement.domain.model;

import lombok.Getter;
import java.time.LocalDate;

@Getter
public class Expense extends Transaction {
    private final ExpenseCategory category;

    public Expense(String description, Double amount, ExpenseCategory category, LocalDate date) {
        super(description, amount, date, TransactionType.GASTO);
        this.category = category;
    }

    public Expense(Long id, String description, Double amount, ExpenseCategory category, LocalDate date) {
        this(description, amount, category, date);
        this.id = id;
    }

    @Override
    public String getCategoryName() {
        return category.name();
    }
}