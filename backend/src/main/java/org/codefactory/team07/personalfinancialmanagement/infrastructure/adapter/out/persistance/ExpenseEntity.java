package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.out.persistance;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private Double amount;
    private String category;

    @Column(name = "transaction_date")
    private LocalDate date;

    private String type;

    @Column(name = "user_id")
    private Long userId;
}