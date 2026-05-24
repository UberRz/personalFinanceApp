package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import org.codefactory.team07.personalfinancialmanagement.config.BudgetProperties;
import org.codefactory.team07.personalfinancialmanagement.domain.model.MonthlyBudget;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.BudgetRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.time.YearMonth;

@Service
@RequiredArgsConstructor
public class GetCurrentBudgetUseCase {

    private final BudgetRepository budgetRepository;
    private final BudgetProperties budgetProperties;

    public MonthlyBudget execute(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("El id de usuario es obligatorio");
        }

        YearMonth current = YearMonth.now();
        return budgetRepository.findByUserIdAndYearAndMonth(userId, current.getYear(), current.getMonthValue())
                .orElse(new MonthlyBudget(null, userId, current.getYear(), current.getMonthValue(), budgetProperties.getDefaultBudget()));
    }
}
