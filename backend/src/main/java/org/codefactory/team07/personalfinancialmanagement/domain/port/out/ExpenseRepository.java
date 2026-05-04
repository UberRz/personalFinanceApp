package org.codefactory.team07.personalfinancialmanagement.domain.port.out;

import java.util.List;
import java.util.Optional;

import org.codefactory.team07.personalfinancialmanagement.domain.model.Expense;
import org.codefactory.team07.personalfinancialmanagement.domain.model.TransactionType;

public interface ExpenseRepository {
    void save(Expense expense);

    double getTotalSpent();

    List<Expense> findAll(Optional<TransactionType> transactionType);

    List<Expense> findAll();

    void deleteById(Long id);
}