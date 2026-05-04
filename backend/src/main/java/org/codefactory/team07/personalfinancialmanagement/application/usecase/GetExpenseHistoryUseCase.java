package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import java.util.List;
import java.util.Optional;

import org.codefactory.team07.personalfinancialmanagement.domain.model.Expense;
import org.codefactory.team07.personalfinancialmanagement.domain.model.TransactionType;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.ExpenseRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class GetExpenseHistoryUseCase {
    private final ExpenseRepository repository;


    public List<Expense> execute() {
        return repository.findAll(Optional.empty(), Optional.empty(), Optional.empty());
    }

    public List<Expense> execute(TransactionType transactionType) {
        return repository.findAll(Optional.ofNullable(transactionType), Optional.empty(), Optional.empty());
    }

    public List<Expense> execute(Optional<TransactionType> transactionType,
                                 Optional<java.time.LocalDate> startDate,
                                 Optional<java.time.LocalDate> endDate) {
        return repository.findAll(transactionType, startDate, endDate);
    }
}
