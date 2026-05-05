package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.out.persistance;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.codefactory.team07.personalfinancialmanagement.domain.model.TransactionType;

import java.time.LocalDate;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private Double amount;
    private String category;

    @Column(name = "transaction_date")
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @Column(name = "user_id")
    private Long userId;
}
