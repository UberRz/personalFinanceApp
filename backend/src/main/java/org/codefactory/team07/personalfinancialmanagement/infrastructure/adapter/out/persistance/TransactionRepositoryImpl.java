package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.out.persistance;

import lombok.RequiredArgsConstructor;
import org.codefactory.team07.personalfinancialmanagement.domain.model.*;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.TransactionRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class TransactionRepositoryImpl implements TransactionRepository {

    private final JpaTransactionRepository jpaRepository;

    @Override
    public void save(Transaction transaction, Long userId) {
        TransactionEntity entity = new TransactionEntity();
        
        entity.setDescription(transaction.getDescription());
        entity.setAmount(transaction.getAmount());
        entity.setCategory(transaction.getCategoryName());
        entity.setDate(transaction.getDate());
        entity.setType(transaction.getType());
        entity.setUserId(userId);

        jpaRepository.save(entity);
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public void deleteByIdAndUserId(Long id, Long userId) {
        jpaRepository.findById(id)
                .filter(entity -> entity.getUserId() != null && entity.getUserId().equals(userId))
                .ifPresent(jpaRepository::delete);
    }

    @Override
    public List<Transaction> findAllByUserId(Long userId) {
        return jpaRepository.findByUserId(userId).stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Transaction> findById(Long id) {
        return jpaRepository.findById(id).map(this::mapToDomain);
    }

    @Override
    public Optional<Long> findUserIdById(Long id) {
        return jpaRepository.findById(id).map(TransactionEntity::getUserId);
    }

    @Override
    public List<Transaction> findFiltered(Long userId, TransactionType type, LocalDate start, LocalDate end) {
        Specification<TransactionEntity> spec = Specification
                .where(TransactionSpecifications.byUserId(userId))
                .and(TransactionSpecifications.byType(type))
                .and(TransactionSpecifications.byDateRange(start, end));
        
        return jpaRepository.findAll(spec).stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    private Transaction mapToDomain(TransactionEntity entity) {
        if (entity.getType() == TransactionType.INGRESO) {
            return new Income(
                entity.getId(),
                entity.getDescription(),
                entity.getAmount(),
                IncomeCategory.valueOf(entity.getCategory()),
                entity.getDate()
            );
        } else {
            return new Expense(
                entity.getId(),
                entity.getDescription(),
                entity.getAmount(),
                ExpenseCategory.valueOf(entity.getCategory()),
                entity.getDate()
            );
        }
    }
}