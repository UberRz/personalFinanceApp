package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.out.persistance;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.LocalDate;

import org.codefactory.team07.personalfinancialmanagement.domain.model.Expense;
import org.codefactory.team07.personalfinancialmanagement.domain.model.TransactionType;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.ExpenseRepository;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ExpenseRepositoryImpl implements ExpenseRepository {
    private final JpaExpenseRepository jpaRepository;

    @Override
    public void save(Expense expense) {
        ExpenseEntity entity = new ExpenseEntity(
                null,
                expense.getDescription(),
                expense.getAmount(),
            expense.getCategory(),
            expense.getDate(),
            expense.getType().name());
        jpaRepository.save(entity);
    }

    @Override
    public double getTotalSpent() {
        return jpaRepository.findAll().stream()
            .filter(entity -> TransactionType.GASTO.name().equalsIgnoreCase(entity.getType()))
                .mapToDouble(ExpenseEntity::getAmount)
                .sum();
    }

    @Override
    public List<Expense> findAll() {
        return findAll(Optional.empty(), Optional.empty(), Optional.empty());
    }

    @Override
    public List<Expense> findAll(Optional<TransactionType> transactionType,
                                 Optional<LocalDate> startDate,
                                 Optional<LocalDate> endDate) {
        // Build combined Specification from optional filters
        org.springframework.data.jpa.domain.Specification<ExpenseEntity> spec = null;

        if (transactionType.isPresent()) {
            spec = ExpenseSpecifications.byTransactionType(transactionType.get());
        }

        org.springframework.data.jpa.domain.Specification<ExpenseEntity> dateSpec =
            ExpenseSpecifications.byDateRange(startDate.orElse(null), endDate.orElse(null));

        if (dateSpec != null) {
            spec = spec == null ? dateSpec : spec.and(dateSpec);
        }

        List<ExpenseEntity> entities = spec == null
            ? jpaRepository.findAll()
            : jpaRepository.findAll(spec);

        return entities.stream()
                .map(entity -> new Expense(
                        entity.getId(),
                        entity.getDescription(),
                        entity.getAmount(),
                        entity.getCategory(),
                        entity.getDate(),
                        entity.getType() == null || entity.getType().isBlank()
                            ? TransactionType.GASTO
                            : TransactionType.valueOf(entity.getType().toUpperCase())))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
}