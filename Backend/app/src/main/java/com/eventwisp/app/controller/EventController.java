package com.eventwisp.app.controller;

import com.eventwisp.app.dto.EventDetailsDto;
import com.eventwisp.app.dto.EventDto;
import com.eventwisp.app.dto.EventUpdateDto;
import com.eventwisp.app.dto.event.EventCounts;
import com.eventwisp.app.dto.event.EventStatusDto;
import com.eventwisp.app.dto.response.EventCreateResponse;
import com.eventwisp.app.dto.response.FindEventByOrganizerResponse;
import com.eventwisp.app.dto.response.ManagersEventsResponse;
import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.dto.response.general.UpdateResponse;
import com.eventwisp.app.entity.Event;
import com.eventwisp.app.service.EventService;
import com.eventwisp.app.service.impl.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class EventController {

    //Create an instance of "EventService"
    private EventService eventService;

    private MailService mailService;

    //Injecting an instance of "EventService"
    @Autowired
    public EventController(EventService eventService,MailService mailService){
        this.eventService=eventService;
        this.mailService=mailService;
    }

    //Create a new event
    @PostMapping("/events")
    public ResponseEntity<?> createEvent(@RequestBody EventDto eventDto){
        try{
            //create a new event
            EventCreateResponse response= eventService.createEvent(eventDto);

            //Check if new event is null
            if(response.getEvent()==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.getMessage());
            }

            //send email
            mailService.addEventEmail(response);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //Find all events
    @GetMapping("/events")
    public ResponseEntity<?> findAllEvents(){
        try{
            List<Event> events=eventService.getAllEvents();

            //Check if there are any events
            if(events.isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No events found");
            }

            return ResponseEntity.status(HttpStatus.OK).body(events);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/events/details")
    public ResponseEntity<?> findManagerEventsList(){
        try{
            //response
            ManagersEventsResponse response= eventService.getManagerEventList();

            //check if there are events
            if(response.getEventDetails().isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.getMessage());
            }

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //find all ongoing events
    @GetMapping("/on-going/events")
    public ResponseEntity<?> findAllOngoingEvents(){
        try{
            Integer onGoingEventsCount=eventService.getAllOnGoingEventsCount();

            if(onGoingEventsCount==0){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Ongoing Events Found found");
            }
            return ResponseEntity.status(HttpStatus.OK).body(onGoingEventsCount);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/organizer/{organizerId}/events/counts")
    public ResponseEntity<?> findEventCounts(@PathVariable Long organizerId){
        try{
            EventCounts eventCounts = eventService.getEventCounts(organizerId);

            // Check if any events exist using the new allEventsCount field
            if(eventCounts.getAllEventsCount() == 0) {
                return ResponseEntity.status(HttpStatus.OK).body("No events found in any status");
            }

            return ResponseEntity.status(HttpStatus.OK).body(eventCounts);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //Find events by organizer
    @GetMapping("/organizers/{organizerId}/events")
    public ResponseEntity<FindEventByOrganizerResponse> findEventsByOrganizer(@PathVariable Long organizerId) {
        try {
            FindEventByOrganizerResponse response = eventService.findEventByOrganizer(organizerId);

            if ("No organizer found for entered id".equals(response.getMessage())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            if ("No events found for the organizer".equals(response.getMessage())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Return structured response instead of plain string
            FindEventByOrganizerResponse errorResponse = new FindEventByOrganizerResponse();
            errorResponse.setMessage("Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }


    @GetMapping("/events/status/{statusId}")
    public ResponseEntity<?> findEventByStatus(@PathVariable Integer statusId){
        try{
            MultipleEntityResponse<EventDetailsDto> response= eventService.getEventsByStatus(statusId);

//            if(response.getEntityList().isEmpty()){
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
//            }

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<?> findEventDetailsById(@PathVariable Long eventId) {
        try {
            // Call service to get event details
            ManagersEventsResponse response = eventService.getEventDetailsById(eventId);

            // Check if event details were found
            if (response.getEventDetails() == null || response.getEventDetails().isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.getMessage());
            }

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //find events by generated id
    @GetMapping("/search/events/{eventId}")
    public ResponseEntity<?> searchEventById(@PathVariable String eventId) {
        try {
            // Call service to get event details by generated event ID (String)
            SingleEntityResponse<EventDetailsDto> response = eventService.getSingleEventByEventId(eventId);

            // Check if event details were found
            if (response.getEntityData() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.getMessage());
            }

            // Return event details if found
            return ResponseEntity.status(HttpStatus.OK).body(response);

        } catch (Exception e) {
            // Handle unexpected errors gracefully
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching event details: " + e.getMessage());
        }
    }
    

    //find events by category
    @GetMapping("/events/categories/{categoryName}")
    public ResponseEntity<?> findEventsByCategory(@PathVariable String categoryName) {
        try {
            MultipleEntityResponse<EventDetailsDto> response = eventService.findUpCommingEventsByCategory(categoryName);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving events: " + e.getMessage());
        }
    }

    //findSingleEventById
    @GetMapping("/events/{eventId}/details")
    public ResponseEntity<?> findSingleEventById(@PathVariable Long eventId) {
        try {
            SingleEntityResponse<EventDetailsDto> response = eventService.getSingleEventById(eventId);

            // Check if event was found
            if (response.getEntityData() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.getMessage());
            }

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //find years of organized events
    @GetMapping("/events/completed/years/organizers/{organizerId}")
    public ResponseEntity<?> findActiveYearsByOrganizer(@PathVariable Long organizerId) {
        try {
            MultipleEntityResponse<Integer> response = eventService.findActiveYearsByOrganizer(organizerId);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving active years: " + e.getMessage());
        }
    }

    //publish event
    @PutMapping("/events/{eventId}/publish")
    public ResponseEntity<?> setEventAsPublic(@PathVariable Long eventId) {
        try {
            SingleEntityResponse<EventStatusDto> response = eventService.setEventPublic(eventId);

            // Check if event was found and updated
            if (response.getEntityData() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.getMessage());
            }

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error publishing event: " + e.getMessage());
        }
    }

    //Update an event
    @PutMapping("events/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id,@RequestBody EventUpdateDto eventUpdateDto){
        try{
            Event updatedEvent= eventService.updateEvent(id,eventUpdateDto);

            //Check if event exists
            if(updatedEvent==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No event found");
            }

            return ResponseEntity.status(HttpStatus.OK).body(updatedEvent);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("events/{id}/status")
    public ResponseEntity<?> updateEventStatus(@PathVariable Long id,@RequestBody EventStatusDto eventStatusDto){
        try{
            UpdateResponse<Event> response= eventService.updateEventStatus(id,eventStatusDto);

            if(response.getUpdatedData()==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.getMessage());
            }

            //send email
            mailService.eventStatusUpdateEmail(response);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //Delete an event
    @DeleteMapping("/events/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id){
        try {
            boolean isDeleted= eventService.deleteEvent(id);

            if(!isDeleted){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No event found");
            }

            return ResponseEntity.status(HttpStatus.OK).body("Event deleted successfully");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


}
