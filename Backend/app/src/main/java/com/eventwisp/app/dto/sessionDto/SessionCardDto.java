package com.eventwisp.app.dto.sessionDto;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Setter
@Getter
public class SessionCardDto {
    private Long sessionId;
    private String eventName;
    private Long eventId;
    private LocalDate startingDate;
    private LocalDate eventAddedDate;
    private LocalTime startingTime;
    private String coverImageLink;
    private String location;
    private String categoryName;
    private Double minTicketPrice;
}
