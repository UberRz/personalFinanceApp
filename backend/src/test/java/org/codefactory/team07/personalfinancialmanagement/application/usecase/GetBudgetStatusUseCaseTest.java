package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import org.codefactory.team07.personalfinancialmanagement.config.BudgetProperties;
import org.codefactory.team07.personalfinancialmanagement.domain.model.Expense;
import org.codefactory.team07.personalfinancialmanagement.domain.model.ExpenseCategory;
import org.codefactory.team07.personalfinancialmanagement.domain.model.Income;
import org.codefactory.team07.personalfinancialmanagement.domain.model.IncomeCategory;
import org.codefactory.team07.personalfinancialmanagement.domain.model.Transaction;
import org.codefactory.team07.personalfinancialmanagement.domain.model.TransactionType;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.BudgetRepository;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.TransactionRepository;
import org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web.BudgetStatusDTO;
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
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GetBudgetStatusUseCaseTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private BudgetProperties budgetProperties;

    @InjectMocks
    private GetBudgetStatusUseCase getBudgetStatusUseCase;

    @Test
    void shouldReturnDefaultBudgetWhenNoBudgetExists() {
        YearMonth now = YearMonth.now();
        LocalDate startOfMonth = now.atDay(1);
        LocalDate endOfMonth = now.atEndOfMonth();

        List<Transaction> transactions = List.of(
            new Income("Sueldo", 1200.0, IncomeCategory.INGRESO_FIJO, now.atDay(5)),
            new Expense("Supermercado", 400.0, ExpenseCategory.ALIMENTACION, now.atDay(8))
        );

        when(transactionRepository.findFiltered(1L, null, startOfMonth, endOfMonth)).thenReturn(transactions);
        when(budgetRepository.findByUserIdAndYearAndMonth(1L, now.getYear(), now.getMonthValue())).thenReturn(Optional.empty());
        when(budgetProperties.getDefaultBudget()).thenReturn(1000.0);

        BudgetStatusDTO status = getBudgetStatusUseCase.execute(1L);

        assertEquals(1000.0, status.getBudget());
        assertEquals(1200.0, status.getTotalIncome());
        assertEquals(400.0, status.getSpent());
        assertEquals(600.0, status.getRemaining());
        assertEquals(40.0, status.getPercentageUsed(), 0.001);
        assertEquals(now.getYear(), status.getYear());
        assertEquals(now.getMonthValue(), status.getMonth());
    }

    @Test
    void shouldCalculateOverBudgetWhenSpendingExceedsLimit() {
        YearMonth now = YearMonth.now();
        LocalDate startOfMonth = now.atDay(1);
        LocalDate endOfMonth = now.atEndOfMonth();

        List<Transaction> transactions = List.of(
            new Income("Sueldo", 1000.0, IncomeCategory.INGRESO_FIJO, now.atDay(5)),
            new Expense("Electrodomésticos", 1200.0, ExpenseCategory.VIVIENDA, now.atDay(10))
        );

        when(transactionRepository.findFiltered(2L, null, startOfMonth, endOfMonth)).thenReturn(transactions);
        when(budgetRepository.findByUserIdAndYearAndMonth(2L, now.getYear(), now.getMonthValue()))
            .thenReturn(Optional.of(new org.codefactory.team07.personalfinancialmanagement.domain.model.MonthlyBudget(2L, 2L, now.getYear(), now.getMonthValue(), 1000.0)));
        when(budgetProperties.getDefaultBudget()).thenReturn(1000.0);

        BudgetStatusDTO status = getBudgetStatusUseCase.execute(2L);

        assertEquals(1000.0, status.getBudget());
        assertEquals(1000.0, status.getTotalIncome());
        assertEquals(1200.0, status.getSpent());
        assertEquals(-200.0, status.getRemaining());
        assertEquals(120.0, status.getPercentageUsed(), 0.001);
    }
}
