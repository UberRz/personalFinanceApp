package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import org.codefactory.team07.personalfinancialmanagement.domain.model.Budget;

public class BudgetStatusDTO {
    private final double limit;
    private final double totalIncome;
    private final double totalSpent;
    private final double available;
    private final double percentageUsed;

    public BudgetStatusDTO(Budget budget) {
        this.limit = budget.getLimit();
        this.totalIncome = budget.getTotalIncome();
        this.totalSpent = budget.getTotalSpent();
        this.available = budget.getAvailable();
        this.percentageUsed = budget.getPercentageUsed();
    }

    public double getLimit() { return limit; }
    public double getTotalIncome() { return totalIncome; }
    public double getTotalSpent() { return totalSpent; }
    public double getAvailable() { return available; }
    public double getPercentageUsed() { return percentageUsed; }
}
