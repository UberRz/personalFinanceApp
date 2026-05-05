package org.codefactory.team07.personalfinancialmanagement.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public abstract class Transaction {
    protected Long id;
    protected String description;
    protected Double amount;
    protected LocalDate date;
    protected TransactionType type;

    public Transaction(String description, Double amount, LocalDate date, TransactionType type) {
        this.description = description;
        this.amount = amount;
        this.date = date;
        this.type = type;
    }

    public Long getId() { return id; }
    public String getDescription() { return description; }
    public Double getAmount() { return amount; }
    public LocalDate getDate() { return date; }
    public TransactionType getType() { return type; }

    public abstract String getCategoryName();
}