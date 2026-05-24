package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.out.persistance;

import lombok.RequiredArgsConstructor;
import org.codefactory.team07.personalfinancialmanagement.domain.model.MonthlyBudget;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.BudgetRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class BudgetRepositoryImpl implements BudgetRepository {

    private final JpaBudgetRepository jpaBudgetRepository;

    @Override
    public Optional<MonthlyBudget> findByUserIdAndYearAndMonth(Long userId, int year, int month) {
        return jpaBudgetRepository.findByUserIdAndYearAndMonth(userId, year, month)
                .map(this::mapToDomain);
    }

    @Override
    public MonthlyBudget save(MonthlyBudget budget) {
        BudgetEntity entity = new BudgetEntity();
        entity.setId(budget.getId());
        entity.setUserId(budget.getUserId());
        entity.setYear(budget.getYear());
        entity.setMonth(budget.getMonth());
        entity.setLimit(budget.getLimit());
        BudgetEntity saved = jpaBudgetRepository.save(entity);
        return mapToDomain(saved);
    }

    private MonthlyBudget mapToDomain(BudgetEntity entity) {
        return new MonthlyBudget(
                entity.getId(),
                entity.getUserId(),
                entity.getYear(),
                entity.getMonth(),
                entity.getLimit()
        );
    }
}
