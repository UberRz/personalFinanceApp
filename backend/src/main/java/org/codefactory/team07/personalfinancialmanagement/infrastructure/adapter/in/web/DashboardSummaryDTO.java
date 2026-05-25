package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {
    private boolean hasData;
    private String periodLabel;
    private double totalIncome;
    private double totalSpent;
    private double available;
    private double budgetLimit;
    private double budgetUsed;
    private double remainingBudget;
    private int transactionCount;
    private double averageTicket;
    private List<DashboardTransactionDTO> recentTransactions;
    private List<DashboardCategoryDTO> expenseCategories;
    private List<DashboardCategoryDTO> incomeCategories;
    private DashboardCategoryDTO topExpenseCategory;
    private DashboardCategoryDTO topIncomeCategory;
    private DashboardTransactionDTO lastTransaction;
}