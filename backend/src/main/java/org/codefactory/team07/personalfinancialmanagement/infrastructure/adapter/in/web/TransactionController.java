package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import lombok.RequiredArgsConstructor;
import org.codefactory.team07.personalfinancialmanagement.application.usecase.DeleteTransactionUseCase;
import org.codefactory.team07.personalfinancialmanagement.application.usecase.GetFilteredTransactionsUseCase;
import org.codefactory.team07.personalfinancialmanagement.application.usecase.GetTransactionsUseCase;
import org.codefactory.team07.personalfinancialmanagement.application.usecase.RegisterTransactionUseCase;
import org.codefactory.team07.personalfinancialmanagement.domain.model.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final RegisterTransactionUseCase registerUseCase;
    private final DeleteTransactionUseCase deleteUseCase;
    private final GetTransactionsUseCase getUseCase;
    private final GetFilteredTransactionsUseCase getFilteredUseCase;

    @PostMapping
    public ResponseEntity<ApiResponse> register(@RequestBody TransactionDTO dto) {
        try {
            Transaction transaction;
            String type = dto.getType().toUpperCase();
            String cleanCategory = dto.getCategory().toUpperCase().trim().replace(" ", "_");

            if (type.contains("INGRESO")) {
                transaction = new Income(
                        dto.getDescription(),
                        dto.getAmount(),
                        IncomeCategory.valueOf(cleanCategory),
                        dto.getDate()
                );
            } else {
                transaction = new Expense(
                        dto.getDescription(),
                        dto.getAmount(),
                        ExpenseCategory.valueOf(cleanCategory),
                        dto.getDate()
                );
            }

            String message = registerUseCase.execute(transaction, dto.getUserId());
            return ResponseEntity.status(201).body(new ApiResponse(message, true, transaction));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse("Error en datos: " + e.getMessage(), false));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponse("Error interno: " + e.getMessage(), false));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransactionDTO>> getAllByUserId(@PathVariable Long userId) {
        List<TransactionDTO> dtos = getUseCase.execute(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        try {
            deleteUseCase.execute(id);
            return ResponseEntity.ok(new ApiResponse("Eliminado correctamente", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse("No se pudo eliminar", false));
        }
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<TransactionDTO>> getHistory(
            @PathVariable Long userId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        TransactionType transactionType = null;
        if (type != null && !type.isBlank()) {
            try {
                transactionType = TransactionType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Si el tipo no es válido, ignorar y traer todos
                transactionType = null;
            }
        }

        List<TransactionDTO> history = getFilteredUseCase.execute(userId, transactionType, startDate, endDate).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(history);
    }

    private TransactionDTO mapToDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setDescription(transaction.getDescription());
        dto.setAmount(transaction.getAmount());
        dto.setCategory(transaction.getCategoryName());
        dto.setDate(transaction.getDate());
        dto.setType(transaction.getType().toString());
        dto.setUserId(null); // No solemos devolver el userId en cada línea del historial
        return dto;
    }
}