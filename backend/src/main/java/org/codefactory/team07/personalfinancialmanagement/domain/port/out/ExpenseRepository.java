package org.codefactory.team07.personalfinancialmanagement.domain.port.out;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.codefactory.team07.personalfinancialmanagement.domain.model.Expense;
import org.codefactory.team07.personalfinancialmanagement.domain.model.TransactionType;

public interface ExpenseRepository {
    void save(Expense expense);

    double getTotalSpent();

    List<Expense> findAll(Optional<TransactionType> transactionType,
                          Optional<LocalDate> startDate,
                          Optional<LocalDate> endDate);

    List<Expense> findAll();

    void deleteById(Long id);
}