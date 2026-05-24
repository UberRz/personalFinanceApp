package org.codefactory.team07.personalfinancialmanagement.domain.model;

public class MonthlyBudget {
    private final Long id;
    private final Long userId;
    private final int year;
    private final int month;
    private final double limit;

    public MonthlyBudget(Long id, Long userId, int year, int month, double limit) {
        if (userId == null) {
            throw new IllegalArgumentException("El id de usuario es obligatorio");
        }
        if (year <= 0) {
            throw new IllegalArgumentException("El año es obligatorio");
        }
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("El mes es obligatorio");
        }
        if (limit <= 0) {
            throw new IllegalArgumentException("El límite de presupuesto debe ser mayor a cero");
        }

        this.id = id;
        this.userId = userId;
        this.year = year;
        this.month = month;
        this.limit = limit;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public int getYear() {
        return year;
    }

    public int getMonth() {
        return month;
    }

    public double getLimit() {
        return limit;
    }

    public MonthlyBudget withLimit(double newLimit) {
        return new MonthlyBudget(this.id, this.userId, this.year, this.month, newLimit);
    }
}
