package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.codefactory.team07.personalfinancialmanagement.domain.model.TransactionType;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardTransactionDTO {
    private Long id;
    private String description;
    private double amount;
    private String category;
    private LocalDate date;
    private TransactionType type;
}