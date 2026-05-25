package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import org.codefactory.team07.personalfinancialmanagement.application.exception.TransactionOwnershipException;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DeleteTransactionUseCaseTest {

    @Mock
    private TransactionRepository repository;

    @InjectMocks
    private DeleteTransactionUseCase deleteTransactionUseCase;

    @Test
    void shouldRejectDeleteWhenTransactionBelongsToAnotherUser() {
        when(repository.findUserIdById(10L)).thenReturn(Optional.of(99L));

        assertThrows(TransactionOwnershipException.class, () -> deleteTransactionUseCase.execute(10L, 7L));
    }

    @Test
    void shouldDeleteWhenTransactionBelongsToUser() {
        when(repository.findUserIdById(10L)).thenReturn(Optional.of(7L));

        deleteTransactionUseCase.execute(10L, 7L);

        verify(repository).deleteById(10L);
    }
}