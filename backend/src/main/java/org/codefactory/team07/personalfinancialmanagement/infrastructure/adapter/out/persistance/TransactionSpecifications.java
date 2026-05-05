package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.out.persistance;

import org.springframework.data.jpa.domain.Specification;
import org.codefactory.team07.personalfinancialmanagement.domain.model.TransactionType;
import java.time.LocalDate;

public class TransactionSpecifications {

    public static Specification<TransactionEntity> byUserId(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("userId"), userId);
    }

    public static Specification<TransactionEntity> byType(TransactionType type) {
        return (root, query, cb) -> type == null ? null : cb.equal(root.get("type"), type);
    }

    public static Specification<TransactionEntity> byDateRange(LocalDate start, LocalDate end) {
        return (root, query, cb) -> {
            if (start != null && end != null) return cb.between(root.get("date"), start, end);
            if (start != null) return cb.greaterThanOrEqualTo(root.get("date"), start);
            if (end != null) return cb.lessThanOrEqualTo(root.get("date"), end);
            return null;
        };
    }
}