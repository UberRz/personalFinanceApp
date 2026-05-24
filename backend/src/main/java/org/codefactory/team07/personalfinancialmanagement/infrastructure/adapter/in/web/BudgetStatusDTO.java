package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import org.codefactory.team07.personalfinancialmanagement.domain.model.Budget;

public class BudgetStatusDTO {
    private final double budget;
    private final double totalIncome;
    private final double spent;
    private final double remaining;
    private final double percentageUsed;
    private final int year;
    private final int month;

    public BudgetStatusDTO(Budget budget, int year, int month) {
        this.budget = budget.getLimit();
        this.totalIncome = budget.getTotalIncome();
        this.spent = budget.getTotalSpent();
        this.remaining = budget.getLimit() - budget.getTotalSpent();
        this.percentageUsed = budget.getPercentageUsed();
        this.year = year;
        this.month = month;
    }

    public double getBudget() { return budget; }
    public double getTotalIncome() { return totalIncome; }
    public double getSpent() { return spent; }
    public double getRemaining() { return remaining; }
    public double getPercentageUsed() { return percentageUsed; }
    public int getYear() { return year; }
    public int getMonth() { return month; }
}
