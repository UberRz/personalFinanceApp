package org.codefactory.team07.personalfinancialmanagement.domain.port.out;

import org.codefactory.team07.personalfinancialmanagement.domain.model.Transaction;
import org.codefactory.team07.personalfinancialmanagement.domain.model.TransactionType;
import org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.out.persistance.TransactionEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository {
    void save(Transaction transaction, Long userId);
    void deleteById(Long id);
    void deleteByIdAndUserId(Long id, Long userId);
    List<Transaction> findAllByUserId(Long userId);
    Optional<Transaction> findById(Long id);
    Optional<Long> findUserIdById(Long id);
    List<Transaction> findFiltered(Long userId, TransactionType type, LocalDate start, LocalDate end);
}