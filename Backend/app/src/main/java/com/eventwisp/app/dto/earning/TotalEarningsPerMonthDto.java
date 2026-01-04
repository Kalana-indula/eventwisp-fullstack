package com.eventwisp.app.dto.earning;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class TotalEarningsPerMonthDto {
    private Integer year;
    private Integer monthNumber;
    private String monthName;
    private BigDecimal totalEarnings=BigDecimal.ZERO;
}
