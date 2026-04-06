package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.out.persistance;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "expenses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;
    private double amount;
    private String category;
    private LocalDate date;
}