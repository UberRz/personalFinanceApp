package org.codefactory.team07.personalfinancialmanagement.domain.model;

import java.time.LocalDate;

import lombok.Getter;

@Getter
public class Expense {
    private final Long id;
    private final String description;
    private final double amount;
    private final Category category;
    private final LocalDate date;

    public Expense(String description, double amount, Category category, LocalDate date) {
        this(null, description, amount, category, date);
    }

    public Expense(Long id, String description, double amount, Category category, LocalDate date) {
        if (amount <= 0)
            throw new IllegalArgumentException("El monto debe ser mayor a 0");
        if (category == null)
            throw new IllegalArgumentException("La categoría no es válida");
        if (date == null)
            throw new IllegalArgumentException("La fecha es obligatoria");

        this.id = id;
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.date = date;
    }
}