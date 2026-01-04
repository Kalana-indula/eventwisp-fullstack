package com.eventwisp.app.dto.transaction;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class CreateTransactionRequest {
    private BigDecimal amount;
    private Long organizerId;
}
