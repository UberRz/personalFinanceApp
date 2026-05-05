package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.out.persistance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

public interface JpaTransactionRepository extends JpaRepository<TransactionEntity, Long>, JpaSpecificationExecutor<TransactionEntity> {
    List<TransactionEntity> findByUserId(Long userId);
}