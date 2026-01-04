package com.eventwisp.app.dto.transaction;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Setter
@Getter
public class TransactionDetails {

    private Long id;
    private String transactionId;
    private BigDecimal amount;
    private Long organizerId;
    private String organizerName;
    private LocalDate date;
    private LocalTime time;
    private String status;
}
