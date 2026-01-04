package com.eventwisp.app.dto.sessionDto;


import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Setter
@Getter
public class SessionDetailsDto {
    private Long id;
    private String sessionNumber;
    private String venue;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer attendees;
    private BigDecimal revenue;
    private BigDecimal profit;
}
