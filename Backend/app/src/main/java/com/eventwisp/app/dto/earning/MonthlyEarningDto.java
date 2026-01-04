package com.eventwisp.app.dto.earning;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class MonthlyEarningDto {

    private Long id;
    private Integer monthNumber;
    private String monthName;
    private Integer year;
    private BigDecimal totalEarnings;
    private Long organizerId;
}
