package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.out.persistance;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaExpenseRepository extends JpaRepository<ExpenseEntity, Long> {
}
