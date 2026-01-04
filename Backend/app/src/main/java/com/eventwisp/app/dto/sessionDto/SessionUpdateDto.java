package com.eventwisp.app.dto.sessionDto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Setter
@Getter
public class SessionUpdateDto {
    private String venue;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
}
