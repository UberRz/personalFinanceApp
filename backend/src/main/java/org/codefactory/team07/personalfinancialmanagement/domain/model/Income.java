package org.codefactory.team07.personalfinancialmanagement.domain.model;

import lombok.Getter;
import java.time.LocalDate;

@Getter
public class Income extends Transaction {
    private final IncomeCategory category;

    public Income(String description, Double amount, IncomeCategory category, LocalDate date) {
        super(description, amount, date, TransactionType.INGRESO);
        this.category = category;
    }

    public Income(Long id, String description, Double amount, IncomeCategory category, LocalDate date) {
        this(description, amount, category, date);
        this.id = id;
    }

    @Override
    public String getCategoryName() {
        return category.name();
    }
}