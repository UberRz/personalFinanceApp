package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import java.util.List;
import java.util.Optional;

import org.codefactory.team07.personalfinancialmanagement.application.usecase.DeleteExpenseUseCase;
import org.codefactory.team07.personalfinancialmanagement.application.usecase.GetExpenseHistoryUseCase;
import org.codefactory.team07.personalfinancialmanagement.application.usecase.RegisterExpenseUseCase;
import org.codefactory.team07.personalfinancialmanagement.domain.model.Category;
import org.codefactory.team07.personalfinancialmanagement.domain.model.Expense;
import org.codefactory.team07.personalfinancialmanagement.domain.model.Income;
import org.codefactory.team07.personalfinancialmanagement.domain.model.IncomeCategory;
import org.codefactory.team07.personalfinancialmanagement.domain.model.TransactionType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

            TransactionType type = resolveType(dto.getType());
            Expense transaction = type == TransactionType.INGRESO
                ? new Income(
                    dto.getDescription(),
                    dto.getAmount(),
                    IncomeCategory.valueOf(dto.getCategory().toUpperCase()),
                    dto.getDate())
                : new Expense(
                    dto.getDescription(),
                    dto.getAmount(),
                    Category.valueOf(dto.getCategory().toUpperCase()),
                    dto.getDate());

            String result = registerUseCase.execute(transaction);
            return ResponseEntity.status(201).body(
                new ApiResponse(result, true, transaction));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse("Error en los datos: " + e.getMessage(), false));
        }
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getHistory(
            @RequestParam(name = "type", required = false) String type) {
        try {
            // Validación: si se envía un tipo inválido, retorna 400
            if (type != null && !type.isBlank()) {
                try {
                    TransactionType.valueOf(type.toUpperCase());
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(null); // 400 Bad Request
                }
                // Si es válido, ejecuta el filtro
                TransactionType transactionType = TransactionType.valueOf(type.toUpperCase());
                return ResponseEntity.ok(getHistoryUseCase.execute(transactionType));
            }
            // EC-02: Sin parámetro, retorna todas
            return ResponseEntity.ok(getHistoryUseCase.execute());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        try {
            deleteUseCase.execute(id);
            return ResponseEntity.ok(
                    new ApiResponse("Registro eliminado correctamente", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ApiResponse("Error al eliminar el registro: " + e.getMessage(), false));
        }
    }

    private TransactionType resolveType(String type) {
        if (type == null || type.isBlank()) {
            return TransactionType.GASTO;
        }
        return TransactionType.valueOf(type.toUpperCase());
    }
}