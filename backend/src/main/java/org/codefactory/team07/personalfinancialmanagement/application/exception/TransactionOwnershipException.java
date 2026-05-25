package org.codefactory.team07.personalfinancialmanagement.application.exception;

public class TransactionOwnershipException extends RuntimeException {
    public TransactionOwnershipException(String message) {
        super(message);
    }
}