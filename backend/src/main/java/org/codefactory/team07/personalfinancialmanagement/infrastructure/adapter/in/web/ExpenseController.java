package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import java.util.List;

import org.codefactory.team07.personalfinancialmanagement.application.usecase.DeleteExpenseUseCase;
import org.codefactory.team07.personalfinancialmanagement.application.usecase.GetExpenseHistoryUseCase;
import org.codefactory.team07.personalfinancialmanagement.application.usecase.RegisterExpenseUseCase;
import org.codefactory.team07.personalfinancialmanagement.domain.model.Category;
import org.codefactory.team07.personalfinancialmanagement.domain.model.Expense;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/expenses")
@RequiredArgsConstructor
public class ExpenseController {
    private final RegisterExpenseUseCase registerUseCase;
    private final GetExpenseHistoryUseCase getHistoryUseCase;
    private final DeleteExpenseUseCase deleteUseCase;

    @PostMapping
    public ResponseEntity<ApiResponse> register(@RequestBody ExpenseDTO dto) {
        try {
            if (dto.getCategory() == null || dto.getCategory().isBlank()) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Error en los datos: la categoría es obligatoria", false));
            }

            Expense expense = new Expense(
                    dto.getDescription(),
                    dto.getAmount(),
                    Category.valueOf(dto.getCategory().toUpperCase()),
                    dto.getDate());
            String result = registerUseCase.execute(expense);
            return ResponseEntity.status(201).body(
                    new ApiResponse(result, true, expense));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse("Error en los datos: " + e.getMessage(), false));
        }
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getHistory() {
        return ResponseEntity.ok(getHistoryUseCase.execute());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        try {
            deleteUseCase.execute(id);
            return ResponseEntity.ok(
                    new ApiResponse("Gasto eliminado correctamente", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ApiResponse("Error al eliminar el gasto: " + e.getMessage(), false));
        }
    }
}