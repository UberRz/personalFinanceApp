package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import java.time.LocalDate;

import lombok.Data;

@Data
public class TransactionDTO {
    private long id;
    private String description;
    private double amount;
    private String category;
    private LocalDate date;
    private String type;
    private Long userId;
}
