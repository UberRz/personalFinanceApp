package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import org.springframework.stereotype.Service;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.TransactionRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeleteTransactionUseCase {
    private final TransactionRepository repository;

    public void execute(Long id) {
        repository.deleteById(id);
    }
}
