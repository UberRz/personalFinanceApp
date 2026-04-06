package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import java.time.LocalDate;

import lombok.Data;

@Data
public class ExpenseDTO {
    private String description;
    private double amount;
    private String category; // Viene como String y lo convertimos a Enum
    private LocalDate date;
}