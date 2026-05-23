package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import org.codefactory.team07.personalfinancialmanagement.domain.model.Budget;
import org.codefactory.team07.personalfinancialmanagement.domain.model.Transaction;
import org.codefactory.team07.personalfinancialmanagement.domain.model.TransactionType;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.TransactionRepository;
import org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web.BudgetStatusDTO;

import java.util.List;

public class GetBudgetStatusUseCase {
    private final TransactionRepository transactionRepository;
    private final double DEFAULT_LIMIT = 1000.0; // En el futuro será configurable por usuario

    public GetBudgetStatusUseCase(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public BudgetStatusDTO execute(Long userId) {
        List<Transaction> transactions = transactionRepository.findAllByUserId(userId);
        double totalIncome = transactions.stream()
            .filter(t -> t.getType() == TransactionType.INGRESO)
            .mapToDouble(Transaction::getAmount)
            .sum();
        double totalSpent = transactions.stream()
            .filter(t -> t.getType() == TransactionType.GASTO)
            .mapToDouble(Transaction::getAmount)
            .sum();
        Budget budget = new Budget(DEFAULT_LIMIT, totalIncome, totalSpent);
        return new BudgetStatusDTO(budget);
    }
}
