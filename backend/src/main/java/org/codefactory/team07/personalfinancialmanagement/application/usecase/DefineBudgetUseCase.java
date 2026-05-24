package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import org.codefactory.team07.personalfinancialmanagement.domain.model.MonthlyBudget;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.BudgetRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.time.YearMonth;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DefineBudgetUseCase {

    private final BudgetRepository budgetRepository;

    public MonthlyBudget execute(Long userId, double limit) {
        if (userId == null) {
            throw new IllegalArgumentException("El id de usuario es obligatorio");
        }
        if (!Double.isFinite(limit) || limit <= 0) {
            throw new IllegalArgumentException("El monto debe ser mayor a cero y finito");
        }

        YearMonth current = YearMonth.now();
        int year = current.getYear();
        int month = current.getMonthValue();

        Optional<MonthlyBudget> existing = budgetRepository.findByUserIdAndYearAndMonth(userId, year, month);

        MonthlyBudget budget = existing
            .map(existingBudget -> existingBudget.withLimit(limit))
            .orElse(new MonthlyBudget(null, userId, year, month, limit));

        return budgetRepository.save(budget);
    }
}
