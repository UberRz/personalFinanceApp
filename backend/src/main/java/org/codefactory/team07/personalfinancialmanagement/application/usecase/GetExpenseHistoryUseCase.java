package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import java.util.List;

import org.codefactory.team07.personalfinancialmanagement.domain.model.Expense;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.ExpenseRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class GetExpenseHistoryUseCase {
    private final ExpenseRepository repository;

    public List<Expense> execute() {
        return repository.findAll();
    }
}
