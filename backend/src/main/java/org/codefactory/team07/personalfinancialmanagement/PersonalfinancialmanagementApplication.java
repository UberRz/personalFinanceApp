package org.codefactory.team07.personalfinancialmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.codefactory.team07.personalfinancialmanagement.application.usecase.GetBudgetStatusUseCase;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.TransactionRepository;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class PersonalfinancialmanagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(PersonalfinancialmanagementApplication.class, args);
	}

	@Bean
	public GetBudgetStatusUseCase getBudgetStatusUseCase(TransactionRepository transactionRepository) {
		return new GetBudgetStatusUseCase(transactionRepository);
	}

}
