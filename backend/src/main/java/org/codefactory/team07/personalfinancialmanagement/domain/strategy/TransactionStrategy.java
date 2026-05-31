package org.codefactory.team07.personalfinancialmanagement.domain.strategy;

import org.codefactory.team07.personalfinancialmanagement.domain.model.Transaction;

public interface TransactionStrategy {
    void process(Transaction transaction);
}
