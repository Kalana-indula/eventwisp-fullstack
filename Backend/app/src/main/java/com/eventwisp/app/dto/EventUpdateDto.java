package com.eventwisp.app.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class EventUpdateDto {
    private LocalDate startingDate;
    private String coverImageLink;
    private String description;
}
