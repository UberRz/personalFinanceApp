package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import org.codefactory.team07.personalfinancialmanagement.domain.model.Budget;
import org.codefactory.team07.personalfinancialmanagement.domain.model.Expense;
import org.codefactory.team07.personalfinancialmanagement.domain.model.ExpenseCategory;
import org.codefactory.team07.personalfinancialmanagement.domain.model.Income;
import org.codefactory.team07.personalfinancialmanagement.domain.model.IncomeCategory;
import org.codefactory.team07.personalfinancialmanagement.domain.model.MonthlyBudget;
import org.codefactory.team07.personalfinancialmanagement.domain.model.Transaction;
import org.codefactory.team07.personalfinancialmanagement.domain.model.TransactionType;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.BudgetRepository;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.TransactionRepository;
import org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web.DashboardSummaryDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GetDashboardSummaryUseCaseTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private GetBudgetStatusUseCase getBudgetStatusUseCase;

    @InjectMocks
    private GetDashboardSummaryUseCase getDashboardSummaryUseCase;

    @Test
    void shouldReturnEmptyDashboardWhenNoDataExists() {
        YearMonth now = YearMonth.now();

        when(transactionRepository.findFiltered(1L, null, now.atDay(1), now.atEndOfMonth())).thenReturn(List.of());
        when(transactionRepository.findAllByUserId(1L)).thenReturn(List.of());
        when(budgetRepository.findByUserIdAndYearAndMonth(1L, now.getYear(), now.getMonthValue())).thenReturn(Optional.empty());
        when(getBudgetStatusUseCase.execute(1L)).thenReturn(new org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web.BudgetStatusDTO(new Budget(1000.0, 0.0, 0.0), now.getYear(), now.getMonthValue()));

        DashboardSummaryDTO result = getDashboardSummaryUseCase.execute(1L);

        assertFalse(result.isHasData());
        assertEquals("todo el historial", result.getPeriodLabel());
        assertEquals(0.0, result.getTotalIncome(), 0.001);
        assertEquals(0.0, result.getTotalSpent(), 0.001);
        assertEquals(1000.0, result.getBudgetLimit(), 0.001);
        assertTrue(result.getRecentTransactions().isEmpty());
        assertTrue(result.getExpenseCategories().isEmpty());
        assertTrue(result.getIncomeCategories().isEmpty());
        assertNull(result.getLastTransaction());
    }

    @Test
    void shouldUseCurrentMonthTransactionsWhenTheyExist() {
        YearMonth now = YearMonth.now();
        LocalDate day5 = now.atDay(5);
        LocalDate day10 = now.atDay(10);
        LocalDate day15 = now.atDay(15);

        List<Transaction> currentMonthTransactions = List.of(
                new Income(1L, "Sueldo", 1500.0, IncomeCategory.INGRESO_FIJO, day5),
                new Expense(2L, "Supermercado", 300.0, ExpenseCategory.ALIMENTACION, day10),
                new Expense(3L, "Transporte", 80.0, ExpenseCategory.TRANSPORTE, day15)
        );

        when(transactionRepository.findFiltered(2L, null, now.atDay(1), now.atEndOfMonth())).thenReturn(currentMonthTransactions);
        when(budgetRepository.findByUserIdAndYearAndMonth(2L, now.getYear(), now.getMonthValue()))
                .thenReturn(Optional.of(new MonthlyBudget(1L, 2L, now.getYear(), now.getMonthValue(), 2000.0)));

        DashboardSummaryDTO result = getDashboardSummaryUseCase.execute(2L);

        assertTrue(result.isHasData());
        assertNotEquals("todo el historial", result.getPeriodLabel());
        assertEquals(1500.0, result.getTotalIncome(), 0.001);
        assertEquals(380.0, result.getTotalSpent(), 0.001);
        assertEquals(1120.0, result.getAvailable(), 0.001);
        assertEquals(2000.0, result.getBudgetLimit(), 0.001);
        assertEquals(19.0, result.getBudgetUsed(), 0.001);
        assertEquals(3, result.getTransactionCount());
        assertEquals(3, result.getRecentTransactions().size());
        assertEquals("Transporte", result.getRecentTransactions().get(0).getDescription());
        assertEquals("ALIMENTACION", result.getTopExpenseCategory().getName());
        assertEquals("INGRESO_FIJO", result.getTopIncomeCategory().getName());
        assertEquals("Transporte", result.getLastTransaction().getDescription());
    }

    @Test
    void shouldFallbackToHistoryWhenCurrentMonthHasNoData() {
        YearMonth now = YearMonth.now();
        LocalDate lastMonth = now.minusMonths(1).atDay(12);
        LocalDate twoMonthsAgo = now.minusMonths(2).atDay(5);

        List<Transaction> history = List.of(
                new Income(11L, "Freelance", 900.0, IncomeCategory.INGRESO_EXTRA, twoMonthsAgo),
                new Expense(12L, "Alquiler", 500.0, ExpenseCategory.VIVIENDA, lastMonth)
        );

        when(transactionRepository.findFiltered(3L, null, now.atDay(1), now.atEndOfMonth())).thenReturn(List.of());
        when(transactionRepository.findAllByUserId(3L)).thenReturn(history);
        when(budgetRepository.findByUserIdAndYearAndMonth(3L, now.getYear(), now.getMonthValue())).thenReturn(Optional.empty());
        when(getBudgetStatusUseCase.execute(3L)).thenReturn(new org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web.BudgetStatusDTO(new Budget(1000.0, 0.0, 0.0), now.getYear(), now.getMonthValue()));

        DashboardSummaryDTO result = getDashboardSummaryUseCase.execute(3L);

        assertTrue(result.isHasData());
        assertEquals("todo el historial", result.getPeriodLabel());
        assertEquals(900.0, result.getTotalIncome(), 0.001);
        assertEquals(500.0, result.getTotalSpent(), 0.001);
        assertEquals(400.0, result.getAvailable(), 0.001);
        assertEquals(2, result.getTransactionCount());
        assertEquals("Alquiler", result.getRecentTransactions().get(0).getDescription());
        assertEquals("VIVIENDA", result.getTopExpenseCategory().getName());
        assertEquals("INGRESO_EXTRA", result.getTopIncomeCategory().getName());
    }

    @Test
    void shouldKeepSingleMonthCategoriesWhenOnlyOneCategoryExists() {
        YearMonth now = YearMonth.now();
        List<Transaction> currentMonthTransactions = List.of(
                new Expense(1L, "Taxi", 40.0, ExpenseCategory.TRANSPORTE, now.atDay(4)),
                new Expense(2L, "Bus", 25.0, ExpenseCategory.TRANSPORTE, now.atDay(9))
        );

        when(transactionRepository.findFiltered(4L, null, now.atDay(1), now.atEndOfMonth())).thenReturn(currentMonthTransactions);
        when(budgetRepository.findByUserIdAndYearAndMonth(4L, now.getYear(), now.getMonthValue()))
                .thenReturn(Optional.of(new MonthlyBudget(2L, 4L, now.getYear(), now.getMonthValue(), 500.0)));

        DashboardSummaryDTO result = getDashboardSummaryUseCase.execute(4L);

        assertEquals(1, result.getExpenseCategories().size());
        assertEquals("TRANSPORTE", result.getExpenseCategories().get(0).getName());
        assertNull(result.getIncomeCategories().stream().findFirst().orElse(null));
    }
}