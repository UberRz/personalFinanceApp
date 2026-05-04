package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.out.persistance;

import org.springframework.data.jpa.domain.Specification;
import org.codefactory.team07.personalfinancialmanagement.domain.model.TransactionType;
import java.time.LocalDate;

public class ExpenseSpecifications {

    public static Specification<ExpenseEntity> byTransactionType(TransactionType transactionType) {
        if (transactionType == null) {
            return null; // Sin filtro = retorna todos
        }
        return (root, query, criteriaBuilder) ->
            criteriaBuilder.equal(root.get("type"), transactionType.name());
    }

    public static Specification<ExpenseEntity> byDateRange(LocalDate start, LocalDate end) {
        if (start == null && end == null) {
            return null;
        }
        return (root, query, criteriaBuilder) -> {
            if (start != null && end != null) {
                return criteriaBuilder.between(root.get("date"), start, end);
            } else if (start != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("date"), start);
            } else {
                return criteriaBuilder.lessThanOrEqualTo(root.get("date"), end);
            }
        };
    }
}
