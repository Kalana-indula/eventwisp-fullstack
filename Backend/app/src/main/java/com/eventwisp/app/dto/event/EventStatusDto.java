package com.eventwisp.app.dto.event;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class EventStatusDto {
    private Boolean isApproved;
    private Boolean isDisapproved;
    private Boolean isStarted;
    private Boolean isCompleted;
    private Boolean isPublic;
}
