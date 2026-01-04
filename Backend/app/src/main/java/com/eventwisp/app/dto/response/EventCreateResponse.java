package com.eventwisp.app.dto.response;

import com.eventwisp.app.entity.Event;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class EventCreateResponse {
    private String message;
    private Event event;
}
