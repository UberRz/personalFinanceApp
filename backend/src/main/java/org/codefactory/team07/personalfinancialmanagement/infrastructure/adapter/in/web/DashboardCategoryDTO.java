package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardCategoryDTO {
    private String name;
    private double amount;
}