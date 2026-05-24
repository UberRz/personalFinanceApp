package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class BudgetRequestDTO {
        @NotNull(message = "El id de usuario es obligatorio")
    private Long userId;

    @NotNull(message = "El límite de presupuesto es obligatorio")
    @Positive(message = "El presupuesto debe ser mayor a cero")
    private Double limit;
}
