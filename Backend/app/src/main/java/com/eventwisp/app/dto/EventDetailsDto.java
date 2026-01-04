package com.eventwisp.app.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Setter
@Getter
public class EventDetailsDto {

    private Long eventId;
    private String generatedId;
    private String eventName;
    private String eventType;
    private String organizer;
    private Long organizerId;
    private LocalDate dateAdded;
    private LocalDate startingDate;
    private LocalDate dateCompleted;
    private String coverImageLink;
    private String eventDescription;
    private Boolean isApproved;
    private Boolean isStarted;
    private Boolean isCompleted;
    private Boolean isDisapproved;
    private Boolean isPublished;
    private String status;
    private BigDecimal earningsByEvent;
    private BigDecimal totalProfit;
    private Double commission;
    private Integer totalAttendeesCount;
}
