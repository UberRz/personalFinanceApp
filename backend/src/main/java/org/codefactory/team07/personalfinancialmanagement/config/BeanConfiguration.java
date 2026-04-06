package org.codefactory.team07.personalfinancialmanagement.config;

import org.codefactory.team07.personalfinancialmanagement.application.usecase.DeleteExpenseUseCase;
import org.codefactory.team07.personalfinancialmanagement.application.usecase.GetExpenseHistoryUseCase;
import org.codefactory.team07.personalfinancialmanagement.application.usecase.RegisterExpenseUseCase;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.ExpenseRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfiguration {
    @Bean
    public RegisterExpenseUseCase registerExpenseUseCase(ExpenseRepository repository) {
        return new RegisterExpenseUseCase(repository);
    }

    @Bean
    public GetExpenseHistoryUseCase getExpenseHistoryUseCase(ExpenseRepository repository) {
        return new GetExpenseHistoryUseCase(repository);
    }

    @Bean
    public DeleteExpenseUseCase deleteExpenseUseCase(ExpenseRepository repository) {
        return new DeleteExpenseUseCase(repository);
    }
}
