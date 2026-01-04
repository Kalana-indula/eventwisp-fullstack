package com.eventwisp.app.service;

import com.eventwisp.app.entity.EventStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface EventStatusService {

    EventStatus createEventStatus(EventStatus eventStatus);

    List<EventStatus> getAllEventStatus();

    EventStatus getEventStatusById(Long statusId);

    EventStatus updateEventStatus(Long statusId, EventStatus eventStatus);
}
