package org.codefactory.team07.personalfinancialmanagement.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class BudgetProperties {

    private final double defaultBudget;

    public BudgetProperties(@Value("${app.default-budget:1000}") double defaultBudget) {
        if (!Double.isFinite(defaultBudget) || defaultBudget <= 0) {
            throw new IllegalArgumentException("El presupuesto por defecto debe ser un valor positivo y finito");
        }
        this.defaultBudget = defaultBudget;
    }

    public double getDefaultBudget() {
        return defaultBudget;
    }
}
