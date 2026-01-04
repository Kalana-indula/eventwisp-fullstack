package com.eventwisp.app.service.impl;

import com.eventwisp.app.entity.EventStatus;
import com.eventwisp.app.repository.EventStatusRepository;
import com.eventwisp.app.service.EventStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventStatusServiceImpl implements EventStatusService {

    private EventStatusRepository eventStatusRepository;

    @Autowired
    public EventStatusServiceImpl(EventStatusRepository eventStatusRepository) {
        this.eventStatusRepository = eventStatusRepository;
    }

    @Override
    public EventStatus createEventStatus(EventStatus eventStatus) {

        EventStatus status=new EventStatus();

        status.setStatusName(eventStatus.getStatusName());

        return eventStatusRepository.save(status);
    }

    @Override
    public List<EventStatus> getAllEventStatus() {
        return eventStatusRepository.findAll();
    }

    @Override
    public EventStatus getEventStatusById(Long statusId) {

        return eventStatusRepository.findById(statusId).orElse(null);
    }

    @Override
    public EventStatus updateEventStatus(Long statusId, EventStatus eventStatus) {

        EventStatus status=eventStatusRepository.findById(statusId).orElse(null);

        if(status==null){
            EventStatus newStatus=new EventStatus();
            newStatus.setStatusName(eventStatus.getStatusName());
            return eventStatusRepository.save(newStatus);
        }
        status.setStatusName(eventStatus.getStatusName());
        return eventStatusRepository.save(status);
    }
}
