package com.eventwisp.app.controller;

import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.dto.sessionDto.EventParticipationDetails;
import com.eventwisp.app.dto.ticket.SessionTicketDetails;
import com.eventwisp.app.service.SessionTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class SessionTicketController {

    private SessionTicketService sessionTicketService;

    @Autowired
    public SessionTicketController(SessionTicketService sessionTicketService) {
        this.sessionTicketService = sessionTicketService;
    }

    //find ticket details for single session
    @GetMapping("/sessions/{sessionId}/tickets")
    public ResponseEntity<?> findTicketDetailsForSession(@PathVariable Long sessionId) {
        try{
            MultipleEntityResponse<SessionTicketDetails> response=sessionTicketService.getTicketDetailsBySessionId(sessionId);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //find ticketing details of event by session
    @GetMapping("/events/{eventId}/ticket-sales")
    public ResponseEntity<?> findEventTicketSalesBySession(@PathVariable Long eventId) {
        try {
            MultipleEntityResponse<EventParticipationDetails> response=sessionTicketService.getEventTicketSalesBySession(eventId);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
