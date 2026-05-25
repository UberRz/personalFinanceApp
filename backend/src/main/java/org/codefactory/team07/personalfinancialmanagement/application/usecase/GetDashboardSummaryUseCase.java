package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import lombok.RequiredArgsConstructor;
import org.codefactory.team07.personalfinancialmanagement.config.BudgetProperties;
import org.codefactory.team07.personalfinancialmanagement.domain.model.MonthlyBudget;
import org.codefactory.team07.personalfinancialmanagement.domain.model.Transaction;
import org.codefactory.team07.personalfinancialmanagement.domain.model.TransactionType;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.BudgetRepository;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.TransactionRepository;
import org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web.DashboardCategoryDTO;
import org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web.DashboardSummaryDTO;
import org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web.DashboardTransactionDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetDashboardSummaryUseCase {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final BudgetProperties budgetProperties;
    private final GetBudgetStatusUseCase getBudgetStatusUseCase;

    public DashboardSummaryDTO execute(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("El id de usuario es obligatorio");
        }

        YearMonth currentMonth = YearMonth.now();
        LocalDate startOfMonth = currentMonth.atDay(1);
        LocalDate endOfMonth = currentMonth.atEndOfMonth();

        List<Transaction> currentPeriodTransactions = transactionRepository.findFiltered(userId, null, startOfMonth, endOfMonth);
        List<Transaction> sourceTransactions = currentPeriodTransactions.isEmpty()
                ? transactionRepository.findAllByUserId(userId)
                : currentPeriodTransactions;

        boolean hasData = !sourceTransactions.isEmpty();
        double totalIncome = sumTransactions(sourceTransactions, TransactionType.INGRESO);
        double totalSpent = sumTransactions(sourceTransactions, TransactionType.GASTO);
        double available = totalIncome - totalSpent;

        double budgetLimit = resolveBudgetLimit(userId, currentMonth);
        double budgetUsed = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100.0 : 0.0;
        double remainingBudget = budgetLimit - totalSpent;

        List<DashboardTransactionDTO> recentTransactions = sourceTransactions.stream()
                .sorted(Comparator.comparing(Transaction::getDate).reversed())
                .limit(5)
                .map(this::toTransactionDto)
                .toList();

        List<DashboardCategoryDTO> expenseCategories = aggregateCategories(sourceTransactions, TransactionType.GASTO);
        List<DashboardCategoryDTO> incomeCategories = aggregateCategories(sourceTransactions, TransactionType.INGRESO);

        DashboardCategoryDTO topExpenseCategory = expenseCategories.isEmpty() ? null : expenseCategories.get(0);
        DashboardCategoryDTO topIncomeCategory = incomeCategories.isEmpty() ? null : incomeCategories.get(0);
        DashboardTransactionDTO lastTransaction = recentTransactions.isEmpty() ? null : recentTransactions.get(0);
        int transactionCount = sourceTransactions.size();
        double averageTicket = transactionCount > 0 ? (totalIncome + totalSpent) / transactionCount : 0.0;

        String periodLabel = currentPeriodTransactions.isEmpty()
                ? "todo el historial"
                : currentMonth.format(DateTimeFormatter.ofPattern("MMMM yyyy", new Locale("es", "ES")));

        return new DashboardSummaryDTO(
                hasData,
                periodLabel,
                totalIncome,
                totalSpent,
                available,
                budgetLimit,
                budgetUsed,
                remainingBudget,
                transactionCount,
                averageTicket,
                recentTransactions,
                expenseCategories,
                incomeCategories,
                topExpenseCategory,
                topIncomeCategory,
                lastTransaction
        );
    }

    private double resolveBudgetLimit(Long userId, YearMonth currentMonth) {
        Optional<MonthlyBudget> budget = budgetRepository.findByUserIdAndYearAndMonth(userId, currentMonth.getYear(), currentMonth.getMonthValue());
        if (budget.isPresent()) {
            return budget.get().getLimit();
        }

        return getBudgetStatusUseCase.execute(userId).getBudget();
    }

    private double sumTransactions(List<Transaction> transactions, TransactionType type) {
        return transactions.stream()
                .filter(transaction -> transaction.getType() == type)
                .mapToDouble(Transaction::getAmount)
                .sum();
    }

    private List<DashboardCategoryDTO> aggregateCategories(List<Transaction> transactions, TransactionType type) {
        Map<String, Double> totalsByCategory = transactions.stream()
                .filter(transaction -> transaction.getType() == type)
                .collect(Collectors.groupingBy(
                        Transaction::getCategoryName,
                        Collectors.summingDouble(Transaction::getAmount)
                ));

        return totalsByCategory.entrySet().stream()
                .map(entry -> new DashboardCategoryDTO(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(DashboardCategoryDTO::getAmount).reversed())
                .toList();
    }

    private DashboardTransactionDTO toTransactionDto(Transaction transaction) {
        return new DashboardTransactionDTO(
                transaction.getId(),
                transaction.getDescription(),
                transaction.getAmount(),
                transaction.getCategoryName(),
                transaction.getDate(),
                transaction.getType()
        );
    }
}