package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import org.codefactory.team07.personalfinancialmanagement.application.exception.TransactionOwnershipException;
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

    public void execute(Long id, Long userId) {
        if (id == null) {
            throw new IllegalArgumentException("El id de la transacción es obligatorio");
        }
        if (userId == null) {
            throw new IllegalArgumentException("El id de usuario es obligatorio");
        }

        Long ownerUserId = repository.findUserIdById(id)
                .orElseThrow(() -> new TransactionOwnershipException("La transacción no existe"));

        if (!ownerUserId.equals(userId)) {
            throw new TransactionOwnershipException("No tienes permiso para eliminar esta transacción");
        }

        repository.deleteById(id);
    }
}
