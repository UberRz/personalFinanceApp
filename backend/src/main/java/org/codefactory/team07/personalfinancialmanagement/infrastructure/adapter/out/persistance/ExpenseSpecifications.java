package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.out.persistance;

import org.springframework.data.jpa.domain.Specification;
import org.codefactory.team07.personalfinancialmanagement.domain.model.TransactionType;

public class ExpenseSpecifications {

    public static Specification<ExpenseEntity> byTransactionType(TransactionType transactionType) {
        if (transactionType == null) {
            return null; // Sin filtro = retorna todos
        }
        return (root, query, criteriaBuilder) ->
            criteriaBuilder.equal(root.get("type"), transactionType.name());
    }
}
