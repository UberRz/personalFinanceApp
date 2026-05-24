package org.codefactory.team07.personalfinancialmanagement.domain.port.out;

import org.codefactory.team07.personalfinancialmanagement.domain.model.MonthlyBudget;

import java.util.Optional;

public interface BudgetRepository {
    Optional<MonthlyBudget> findByUserIdAndYearAndMonth(Long userId, int year, int month);
    MonthlyBudget save(MonthlyBudget budget);
}
