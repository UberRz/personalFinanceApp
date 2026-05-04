package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.out.persistance;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
        return findAll(Optional.empty());
    }

    @Override
    public List<Expense> findAll(Optional<TransactionType> transactionType) {
        List<ExpenseEntity> entities = transactionType
            .map(type -> jpaRepository.findAll(ExpenseSpecifications.byTransactionType(type)))
            .orElseGet(() -> jpaRepository.findAll());
        
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