package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import org.codefactory.team07.personalfinancialmanagement.domain.model.MonthlyBudget;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.BudgetRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.YearMonth;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DefineBudgetUseCaseTest {

    @Mock
    private BudgetRepository budgetRepository;

    @InjectMocks
    private DefineBudgetUseCase defineBudgetUseCase;

    @Test
    void shouldCreateBudgetWhenNoneExists() {
        YearMonth current = YearMonth.now();
        when(budgetRepository.findByUserIdAndYearAndMonth(1L, current.getYear(), current.getMonthValue()))
            .thenReturn(Optional.empty());
        when(budgetRepository.save(any(MonthlyBudget.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MonthlyBudget result = defineBudgetUseCase.execute(1L, 1200.0);

        assertNotNull(result);
        assertEquals(1L, result.getUserId());
        assertEquals(1200.0, result.getLimit());
        assertEquals(current.getYear(), result.getYear());
        assertEquals(current.getMonthValue(), result.getMonth());
        verify(budgetRepository).save(any(MonthlyBudget.class));
    }

    @Test
    void shouldUpdateExistingBudgetInSameMonth() {
        YearMonth current = YearMonth.now();
        MonthlyBudget existing = new MonthlyBudget(1L, 1L, current.getYear(), current.getMonthValue(), 1000.0);
        when(budgetRepository.findByUserIdAndYearAndMonth(1L, current.getYear(), current.getMonthValue()))
            .thenReturn(Optional.of(existing));
        when(budgetRepository.save(any(MonthlyBudget.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MonthlyBudget result = defineBudgetUseCase.execute(1L, 1500.0);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(1500.0, result.getLimit());
        assertEquals(existing.getYear(), result.getYear());
        assertEquals(existing.getMonth(), result.getMonth());
        verify(budgetRepository).save(any(MonthlyBudget.class));
    }

    @Test
    void shouldRejectInvalidBudgetLimits() {
        assertThrows(IllegalArgumentException.class, () -> defineBudgetUseCase.execute(1L, 0.0));
        assertThrows(IllegalArgumentException.class, () -> defineBudgetUseCase.execute(1L, -100.0));
        assertThrows(IllegalArgumentException.class, () -> defineBudgetUseCase.execute(1L, Double.NaN));
    }
}
