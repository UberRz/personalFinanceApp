package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import org.codefactory.team07.personalfinancialmanagement.domain.port.out.ExpenseRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class DeleteExpenseUseCase {
    private final ExpenseRepository repository;

    public void execute(Long id) {
        repository.deleteById(id);
    }
}
