package org.codefactory.team07.personalfinancialmanagement.domain.port.out;

import java.util.List;

import org.codefactory.team07.personalfinancialmanagement.domain.model.Expense;

public interface ExpenseRepository {
    void save(Expense expense);

    double getTotalSpent();

    List<Expense> findAll();

    void deleteById(Long id);
}