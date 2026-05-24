package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.codefactory.team07.personalfinancialmanagement.application.usecase.DefineBudgetUseCase;
import org.codefactory.team07.personalfinancialmanagement.application.usecase.GetBudgetStatusUseCase;
import org.codefactory.team07.personalfinancialmanagement.application.usecase.GetCurrentBudgetUseCase;
import org.codefactory.team07.personalfinancialmanagement.domain.model.MonthlyBudget;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
@Validated
@RequiredArgsConstructor
public class BudgetController {

    private final DefineBudgetUseCase defineBudgetUseCase;
    private final GetBudgetStatusUseCase getBudgetStatusUseCase;
    private final GetCurrentBudgetUseCase getCurrentBudgetUseCase;

    @GetMapping("/budget-status/{userId}")
    public ResponseEntity<BudgetStatusDTO> getBudgetStatus(@PathVariable Long userId) {
        BudgetStatusDTO status = getBudgetStatusUseCase.execute(userId);
        return ResponseEntity.ok(status);
    }

    @GetMapping("/budget/{userId}")
    public ResponseEntity<BudgetDTO> getCurrentBudget(@PathVariable Long userId) {
        MonthlyBudget budget = getCurrentBudgetUseCase.execute(userId);
        return ResponseEntity.ok(new BudgetDTO(budget.getLimit(), budget.getYear(), budget.getMonth()));
    }

    @PostMapping("/budget")
    public ResponseEntity<ApiResponse> defineBudget(@Valid @RequestBody BudgetRequestDTO dto) {
        try {
            MonthlyBudget budget = defineBudgetUseCase.execute(dto.getUserId(), dto.getLimit());
            BudgetDTO response = new BudgetDTO(budget.getLimit(), budget.getYear(), budget.getMonth());
            return ResponseEntity.status(201).body(new ApiResponse("Presupuesto definido correctamente", true, response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse("Error en datos: " + e.getMessage(), false));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponse("Error interno: " + e.getMessage(), false));
        }
    }
}
