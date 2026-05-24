package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import org.codefactory.team07.personalfinancialmanagement.config.BudgetProperties;
import org.codefactory.team07.personalfinancialmanagement.domain.model.Budget;
import org.codefactory.team07.personalfinancialmanagement.domain.model.MonthlyBudget;
import org.codefactory.team07.personalfinancialmanagement.domain.model.Transaction;
import org.codefactory.team07.personalfinancialmanagement.domain.model.TransactionType;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.BudgetRepository;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.TransactionRepository;
import org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web.BudgetStatusDTO;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GetBudgetStatusUseCase {
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final BudgetProperties budgetProperties;

    public BudgetStatusDTO execute(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("El id de usuario es obligatorio");
        }

        YearMonth current = YearMonth.now();
        LocalDate startOfMonth = current.atDay(1);
        LocalDate endOfMonth = current.atEndOfMonth();

        List<Transaction> transactions = transactionRepository.findFiltered(userId, null, startOfMonth, endOfMonth);
        double totalIncome = transactions.stream()
            .filter(t -> t.getType() == TransactionType.INGRESO)
            .mapToDouble(Transaction::getAmount)
            .sum();
        double totalSpent = transactions.stream()
            .filter(t -> t.getType() == TransactionType.GASTO)
            .mapToDouble(Transaction::getAmount)
            .sum();

        double limit = budgetRepository.findByUserIdAndYearAndMonth(userId, current.getYear(), current.getMonthValue())
            .map(MonthlyBudget::getLimit)
            .orElse(budgetProperties.getDefaultBudget());

        Budget budget = new Budget(limit, totalIncome, totalSpent);
        return new BudgetStatusDTO(budget, current.getYear(), current.getMonthValue());
    }
}
