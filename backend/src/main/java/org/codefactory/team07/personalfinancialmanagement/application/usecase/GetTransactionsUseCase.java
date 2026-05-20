package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import org.codefactory.team07.personalfinancialmanagement.domain.model.Transaction;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.TransactionRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GetTransactionsUseCase {
    private final TransactionRepository repository;

    public List<Transaction> execute(Long userId) {
        return repository.findAllByUserId(userId);
    }
}