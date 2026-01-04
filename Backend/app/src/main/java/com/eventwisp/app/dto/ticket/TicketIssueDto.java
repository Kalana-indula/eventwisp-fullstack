package com.eventwisp.app.dto.ticket;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Setter
@Getter
public class TicketIssueDto {
    private String bookingId;
    private String eventName;
    private LocalDate issueDate;
    private LocalTime issueTime;
    private Boolean ticketIssued;
}
