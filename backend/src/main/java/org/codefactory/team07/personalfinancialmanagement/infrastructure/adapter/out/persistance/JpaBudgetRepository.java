package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.out.persistance;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface JpaBudgetRepository extends JpaRepository<BudgetEntity, Long> {
    Optional<BudgetEntity> findByUserIdAndYearAndMonth(Long userId, Integer year, Integer month);
}
