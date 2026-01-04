package com.eventwisp.app.dto.finance;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class FinancialDataDto {

    private Double commission;
    private BigDecimal platformBalance;
}
