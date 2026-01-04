package com.eventwisp.app.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "transactions_tracker")
public class TransactionsTracker {

    @Id
    @Column(name = "id")
    private String date;

    @Column(name = "sequence")
    private Long sequence;
}
