package org.codefactory.team07.personalfinancialmanagement.domain.model;

import java.util.List;

public class Budget {
    private final double limit;
    private final double totalIncome;
    private final double totalSpent;

    public Budget(double limit, double totalIncome, double totalSpent) {
        this.limit = limit;
        this.totalIncome = totalIncome;
        this.totalSpent = totalSpent;
    }

    public double getLimit() {
        return limit;
    }

    public double getTotalIncome() {
        return totalIncome;
    }

    public double getTotalSpent() {
        return totalSpent;
    }

    public double getAvailable() {
        return totalIncome - totalSpent;
    }

    public double getPercentageUsed() {
        if (limit == 0) return 0;
        return (totalSpent / limit) * 100.0;
    }
}
