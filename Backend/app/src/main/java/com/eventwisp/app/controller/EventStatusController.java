package com.eventwisp.app.controller;

import com.eventwisp.app.entity.EventStatus;
import com.eventwisp.app.service.EventStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class EventStatusController {

    private EventStatusService eventStatusService;

    @Autowired
    public EventStatusController(EventStatusService eventStatusService) {
        this.eventStatusService = eventStatusService;
    }

    @PostMapping("/event-status")
    public ResponseEntity<?> createEventStatus(@RequestBody EventStatus eventStatus) {
        try{

            EventStatus status=eventStatusService.createEventStatus(eventStatus);

            return ResponseEntity.status(HttpStatus.OK).body(status);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/event-status")
    public ResponseEntity<?> findAllEventStatus() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(eventStatusService.getAllEventStatus());
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/event-status/{id}")
    public ResponseEntity<?> findEventStatusById(@PathVariable Long id) {
        try {
            EventStatus status=eventStatusService.getEventStatusById(id);

            if(status==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not Found");
            }

            return ResponseEntity.status(HttpStatus.OK).body(status);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/event-status/{id}")
    public ResponseEntity<?> updateEventStatus(@PathVariable Long id, @RequestBody EventStatus eventStatus) {
        try {
            EventStatus updatedStatus = eventStatusService.updateEventStatus(id, eventStatus);
            if (updatedStatus == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event status not found");
            }
            return ResponseEntity.status(HttpStatus.OK).body(updatedStatus);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating event status: " + e.getMessage());
        }
    }
}
