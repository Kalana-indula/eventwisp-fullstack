package com.eventwisp.app.dto.finance;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class UpdateBalance {
    private BigDecimal balance;
}
