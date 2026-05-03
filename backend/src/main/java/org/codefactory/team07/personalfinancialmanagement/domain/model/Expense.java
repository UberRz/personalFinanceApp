package org.codefactory.team07.personalfinancialmanagement.domain.model;

import java.time.LocalDate;

import lombok.Getter;

@Getter
public class Expense {
    private final Long id;
    private final String description;
    private final double amount;
    private final String category;
    private final LocalDate date;
    private final TransactionType type;

    public Expense(String description, double amount, Category category, LocalDate date) {
        this(null, description, amount, requireCategoryName(category), date, TransactionType.GASTO);
    }

    public Expense(Long id, String description, double amount, Category category, LocalDate date) {
        this(id, description, amount, requireCategoryName(category), date, TransactionType.GASTO);
    }

    public Expense(String description, double amount, String category, LocalDate date, TransactionType type) {
        this(null, description, amount, category, date, type);
    }

    public Expense(Long id, String description, double amount, String category, LocalDate date, TransactionType type) {
        if (amount <= 0) {
            throw new IllegalArgumentException("El monto debe ser mayor a 0");
        }
        if (category == null || category.isBlank()) {
            throw new IllegalArgumentException("La categoría no es válida");
        }
        if (date == null) {
            throw new IllegalArgumentException("La fecha es obligatoria");
        }
        if (type == null) {
            throw new IllegalArgumentException("El tipo de transacción es obligatorio");
        }

        this.id = id;
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.type = type;
    }

    private static String requireCategoryName(Category category) {
        if (category == null) {
            throw new IllegalArgumentException("La categoría no es válida");
        }
        return category.name();
    }
}
