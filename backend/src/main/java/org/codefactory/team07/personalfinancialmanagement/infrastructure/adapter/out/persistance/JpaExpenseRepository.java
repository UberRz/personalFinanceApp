package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.out.persistance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JpaExpenseRepository extends JpaRepository<ExpenseEntity, Long>, JpaSpecificationExecutor<ExpenseEntity> {
}
