package com.eventwisp.app.dto.event;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class OrganizerEventDetailsDto {
    private Long eventId;
    private String generatedId;
    private String eventName;
    private LocalDate dateAdded;
    private LocalDate startingDate;
    private String coverImageLink;
    private String description;
    private String eventCategory;
    private String eventStatus;
    private String organizerName;
}
