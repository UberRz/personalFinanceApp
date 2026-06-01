package org.codefactory.team07.personalfinancialmanagement.application.usecase;


import org.codefactory.team07.personalfinancialmanagement.domain.model.Transaction;
import org.codefactory.team07.personalfinancialmanagement.domain.model.TransactionType;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.TransactionRepository;
import org.codefactory.team07.personalfinancialmanagement.domain.strategy.TransactionStrategy;
import org.codefactory.team07.personalfinancialmanagement.domain.strategy.IncomeStrategy;
import org.codefactory.team07.personalfinancialmanagement.domain.strategy.ExpenseStrategy;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegisterTransactionUseCase {
    private final TransactionRepository repository;

    public String execute(Transaction transaction, Long userId) {
        if (transaction.getAmount() <= 0) {
            throw new IllegalArgumentException("El monto debe ser mayor a cero");
        }

        TransactionStrategy strategy;
        if (transaction.getType() == TransactionType.INGRESO) {
            strategy = new IncomeStrategy();
        } else {
            strategy = new ExpenseStrategy();
        }
        strategy.process(transaction);

        repository.save(transaction, userId);

        return transaction.getType() == TransactionType.INGRESO ? "Ingreso registrado" : "Gasto registrado";
    }
}