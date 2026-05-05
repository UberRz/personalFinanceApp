package org.codefactory.team07.personalfinancialmanagement.domain.port.out;

import org.codefactory.team07.personalfinancialmanagement.domain.model.Transaction;
import org.codefactory.team07.personalfinancialmanagement.domain.model.TransactionType;
import org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.out.persistance.TransactionEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository {
    void save(Transaction transaction, Long userId); // Agregado userId
    void deleteById(Long id);
    List<Transaction> findAllByUserId(Long userId); // Devuelve Dominio, no Entity
    Optional<Transaction> findById(Long id);
    List<Transaction> findFiltered(Long userId, TransactionType type, LocalDate start, LocalDate end);
}