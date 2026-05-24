package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetDTO {
    private double limit;
    private int year;
    private int month;
}
