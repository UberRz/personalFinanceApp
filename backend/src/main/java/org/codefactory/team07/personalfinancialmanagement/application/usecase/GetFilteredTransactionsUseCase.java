package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import lombok.RequiredArgsConstructor;
import org.codefactory.team07.personalfinancialmanagement.domain.model.Transaction;
import org.codefactory.team07.personalfinancialmanagement.domain.model.TransactionType;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.TransactionRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GetFilteredTransactionsUseCase {
    private final TransactionRepository repository;

    public List<Transaction> execute(Long userId, TransactionType type, LocalDate start, LocalDate end) {
        return repository.findFiltered(userId, type, start, end);
    }
}